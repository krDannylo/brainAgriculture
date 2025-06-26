import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { AuthService } from './auth.service';
import { CreateFarmerDto } from '../farmer/dto/create-farmer.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signIn')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.authenticate(signInDto)
  }

  @Post('signUp')
  signUp(@Body() signUpDto: CreateFarmerDto) {
    return this.authService.register(signUpDto)
  }
}
