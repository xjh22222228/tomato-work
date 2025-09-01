import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { GithubLoginDto } from './dto/github-login.dto'

@Controller('passport')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post('code')
  githubLogin(@Body() githubLoginDto: GithubLoginDto) {
    return this.authService.githubLogin(githubLoginDto)
  }
}
