// 生成迁移文件（根据实体变更自动生成）:
// npm run migration:generate -- migrations/sql

// 创建空白迁移文件（手动编写 SQL）:
// npm run migration:create -- migrations/sql

// 执行迁移:
// npm run migration:run

// 回滚最近的迁移:
// npm run migration:revert

import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as tsconfig from 'tsconfig-paths'

// 注册路径别名
const { absoluteBaseUrl, paths } = require('./tsconfig.json').compilerOptions
tsconfig.register({
  baseUrl: absoluteBaseUrl || '.',
  paths: paths || { '@/*': ['src/*'] },
})

// 导入转换器工具
// import {
//   dateTransformer,
//   numberTransformer,
// } from './src/utils/transformerUtils';
// global.dateTransformer = dateTransformer;
// global.numberTransformer = numberTransformer;

// 根据环境加载不同的 .env 文件
const env = process.env.NODE_ENV || 'local'
const envFilePath = `.env.${env}`
dotenv.config({ path: path.resolve(process.cwd(), envFilePath) })

console.log('ENV:', path.resolve(process.cwd(), envFilePath), process.env)

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  timezone: '+08:00',
})
