import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from '../modules/users/users.service'

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('登录失效，请重新登录')
    }

    try {
      // 通过 token 查找用户
      const user = await this.usersService.findByToken(token)

      if (!user) {
        throw new UnauthorizedException('登录失效，请重新登录')
      }

      // 将用户信息附加到请求对象
      request['user'] = user
      return true
    } catch {
      throw new UnauthorizedException('登录失效，请重新登录')
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // 从请求头中提取 token
    const token =
      request.headers.token ||
      request.headers.authorization ||
      (request.body && request.body.token)

    return token ? String(token) : undefined
  }
}
