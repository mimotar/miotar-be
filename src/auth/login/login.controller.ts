import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';

@Controller('auth/login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  create(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }
}
