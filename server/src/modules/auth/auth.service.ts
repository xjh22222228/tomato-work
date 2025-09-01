import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { GithubLoginDto } from './dto/github-login.dto'
import { lastValueFrom } from 'rxjs'
import { AxiosResponse } from 'axios'
import { md5 } from '@/utils/crypto'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async validateUser(loginName: string, password: string): Promise<any> {
    const user = await this.usersService.findByLoginNameAndPassword(
      loginName,
      password,
    )
    if (!user) {
      return null
    }

    const { password: _, ...result } = user
    return result
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.loginName, loginDto.password)
    if (!user) {
      throw new HttpException(
        '用户名或密码错误',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }

    const { password: _, ...result } = user
    return {
      token: user.token,
      user: {
        ...result,
        token: user.token,
      },
    }
  }

  async githubLogin(githubLoginDto: GithubLoginDto) {
    try {
      // 获取GitHub配置
      const clientId = this.configService.get<string>('GITHUB_CLIENT_ID')
      const clientSecret = this.configService.get<string>(
        'GITHUB_CLIENT_SECRET',
      )

      if (!clientId || !clientSecret) {
        throw new HttpException(
          'GitHub配置缺失',
          HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }

      // 使用code获取access_token
      const tokenResponse = await lastValueFrom<
        AxiosResponse<{ access_token: string }>
      >(
        this.httpService.post(
          'https://github.com/login/oauth/access_token',
          {
            client_id: clientId,
            client_secret: clientSecret,
            code: githubLoginDto.code,
          },
          {
            headers: { Accept: 'application/json' },
          },
        ),
      )

      const accessToken = tokenResponse.data.access_token
      if (!accessToken) {
        throw new HttpException('获取GitHub Token失败', HttpStatus.BAD_REQUEST)
      }

      // 获取GitHub用户信息
      const userResponse = await lastValueFrom<AxiosResponse<any>>(
        this.httpService.get('https://api.github.com/user', {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: 'application/json',
          },
        }),
      )

      const githubUser = userResponse.data

      // 为GitHub用户生成MD5密码
      const defaultPassword = md5('123456')

      // 组装用户信息
      const userInfo = {
        uid: Number(githubUser.id),
        provider: 'github',
        loginName: githubUser.login,
        username: githubUser.name || githubUser.login,
        token: accessToken,
        avatarUrl: githubUser.avatar_url,
        location: githubUser.location,
        bio: githubUser.bio,
        email: githubUser.email,
        password: defaultPassword, // 使用MD5加密的默认密码
      }

      // 先通过 uid 查找用户
      let user = await this.usersService.findOne(userInfo.uid)

      // 如果通过 uid 没找到，再通过登录名查找
      if (!user) {
        const foundUser = await this.usersService.findByLoginName(
          userInfo.loginName,
        )
        if (foundUser) {
          user = foundUser
        }
      }

      if (user) {
        // 更新用户信息，但不更新密码，保留原密码
        const { password, ...updateInfo } = userInfo
        user = await this.usersService.update(user.uid, {
          ...updateInfo,
          token: accessToken,
        })
      } else {
        // 创建新用户
        user = await this.usersService.create(userInfo)
      }
      if (user) {
        const { password: _, ...result } = user
        return {
          token: accessToken,
          user: result,
        }
      } else {
        throw new InternalServerErrorException('创建用户失败')
      }
    } catch (error) {
      throw new HttpException(
        error.message || 'GitHub登录失败',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
