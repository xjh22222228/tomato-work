import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 设置全局前缀
  app.setGlobalPrefix('api')

  // 启用CORS
  app.enableCors()

  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const port = process.env.PORT || 7003
  await app.listen(port, '0.0.0.0')
  console.log(`Server running on http://localhost:${port}`)
}
bootstrap()
