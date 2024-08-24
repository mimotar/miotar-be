import { Body, Controller, Post } from '@nestjs/common';
import { PasswordResetService } from './password-reset.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth/password-reset')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @Post('forgot')
  forgot(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.passwordResetService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset')
  reset(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.passwordResetService.resetPassword(resetPasswordDto);
  }
}
