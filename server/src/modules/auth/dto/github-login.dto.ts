import { IsNotEmpty, IsString } from 'class-validator'

export class GithubLoginDto {
  @IsNotEmpty()
  @IsString()
  code: string
}
