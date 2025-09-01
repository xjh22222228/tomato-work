import { createParamDecorator, ExecutionContext } from '@nestjs/common'

/**
 * 获取当前登录用户的装饰器
 * 使用示例: @User() user: any
 */
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user

    return data ? user?.[data] : user
  },
)
