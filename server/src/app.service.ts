import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return 'https://github.com/xjh22222228/tomato-work'
  }
}
