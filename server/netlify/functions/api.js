import { NestFactory } from '@nestjs/core'
import { AppModule } from '../../dist/src/app.module.js'
import serverless from 'serverless-http'
import { ValidationPipe } from '@nestjs/common'

let cachedServer

async function bootstrap() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api')
    app.enableCors()
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    await app.init()
    cachedServer = serverless(app.getHttpAdapter().getInstance())
  }
  return cachedServer
}

export const handler = async (event, context) => {
  const server = await bootstrap()
  return server(event, context)
}
