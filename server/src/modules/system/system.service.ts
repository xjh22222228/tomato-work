import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import * as os from 'os'

@Injectable()
export class SystemService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async getSystemInfo() {
    // 获取 MySQL 版本信息
    const mysqlResult = await this.dataSource.query(
      'SELECT VERSION() as mysqlVersion',
    )
    const mysqlVersion = mysqlResult[0]?.mysqlVersion || ''

    return {
      mysqlVersion,
      currentSystemTime: Date.now(),
      freemem: os.freemem(),
      totalmem: os.totalmem(),
      platform: os.platform(),
      type: os.type(),
      hostname: os.hostname(),
      arch: os.arch(),
      nodeVersion: process.version,
      cpus: os.cpus(),
    }
  }
}
