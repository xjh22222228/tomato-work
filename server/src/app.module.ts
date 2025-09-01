import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './modules/users/users.module'
import { BillsModule } from './modules/bills/bills.module'
import { BillTypesModule } from './modules/bill-types/bill-types.module'
import { TasksModule } from './modules/tasks/tasks.module'
import { TodoListsModule } from './modules/todo-lists/todo-lists.module'
import { RemindersModule } from './modules/reminders/reminders.module'
import { MemorandumsModule } from './modules/memorandums/memorandums.module'
import { InnerMessagesModule } from './modules/inner-messages/inner-messages.module'
import { LogsModule } from './modules/logs/logs.module'
import { CompanyModule } from './modules/company/company.module'
import { AuthModule } from './modules/auth/auth.module'
import { UserConfiguresModule } from './modules/user-configures/user-configures.module'
import { MailModule } from './modules/mail/mail.module'
import { GuardsModule } from './guards/guards.module'
import { CommonModule } from './modules/common/common.module'
import { GlobalModulesModule } from './global-modules/global-modules.module'
import { SystemModule } from './modules/system/system.module'
import * as path from 'node:path'
import * as dotenv from 'dotenv'
import * as fs from 'node:fs'

const productPath = path.resolve('.env.production')
const developmentPath = path.resolve('.env.development')
const localPath = path.resolve('.env.local')

function getEnvFilePath(): string | undefined {
  const env = process.env.NODE_ENV
  const existsProductPath = fs.existsSync(productPath)
  const existsDevelopmentPath = fs.existsSync(developmentPath)
  const existsLocalPath = fs.existsSync(localPath)
  if (env === 'production' && existsProductPath) {
    return productPath
  } else if (env === 'development' && existsDevelopmentPath) {
    return developmentPath
  } else if (env === 'local' && existsLocalPath) {
    return localPath
  }
}

export const configuration = () => {
  const parsedEnv = dotenv.parse<Record<string, string>>(
    fs.readFileSync(developmentPath),
  )

  const envMap = {}
  for (const k in parsedEnv) {
    if (process.env[k]) {
      envMap[k] = process.env[k]
    }
  }
  if (getEnvFilePath()) {
    const env = dotenv.parse(fs.readFileSync(getEnvFilePath() as string))
    if (env) {
      return {
        ...env,
        ...envMap,
      }
    }
  }

  return envMap
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const payload: TypeOrmModuleOptions = {
          type: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: Number(configService.get<number>('MYSQL_PORT')),
          username: configService.get('MYSQL_USERNAME'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('MYSQL_SYNCHRONIZE') === 'true',
          logging: ['query', 'error'],
          timezone: '+08:00',
        }
        console.debug('TypeORM Config:', payload)
        return payload
      },
    }),
    GlobalModulesModule,
    UsersModule,
    BillsModule,
    BillTypesModule,
    TasksModule,
    TodoListsModule,
    RemindersModule,
    MemorandumsModule,
    InnerMessagesModule,
    LogsModule,
    CompanyModule,
    AuthModule,
    UserConfiguresModule,
    MailModule,
    GuardsModule,
    CommonModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
