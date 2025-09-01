import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from '../users.service'
import { Request } from 'express'
import { ModuleRef } from '@nestjs/core'

@Injectable()
export class UserControllerAuthGuard implements CanActivate {
  private usersService: UsersService

  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.usersService = this.moduleRef.get(UsersService, { strict: false })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 如果 usersService 没有被注入，通过 moduleRef 获取
    if (!this.usersService) {
      this.usersService = this.moduleRef.get(UsersService, { strict: false })
    }

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

    return token ? token.toString() : undefined
  }
}
