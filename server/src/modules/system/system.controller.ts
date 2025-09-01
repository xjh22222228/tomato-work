import { Controller, Post } from '@nestjs/common'
import { SystemService } from './system.service'

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('info')
  async getSystemInfo() {
    return this.systemService.getSystemInfo()
  }
}
