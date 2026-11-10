import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service.js';
import { SignupDto } from './dto/signup.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/signup')
  signup(@Body() body: SignupDto) {
    return this.authenticationService.signup(body)
  }

  @Post('/login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authenticationService.login(body)
    
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 360000000
    })

    return 'Login successful'
  }
}
