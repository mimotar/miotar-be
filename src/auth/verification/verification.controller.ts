import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from './verification.service';
import { AuthenticationGuard } from 'src/common/guards/authentication/authentication.guard';
import { VerifyAccountDto } from './dto/verify-account.dto';

@Controller('auth/verification')
@UseGuards(AuthenticationGuard)
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('verify')
  verify(@Request() req, @Body() verifyAccountDto: VerifyAccountDto) {
    return this.verificationService.verify(req.user.userId, verifyAccountDto);
  }

  @Get('resend-mail')
  resendMail(@Request() req) {
    return this.verificationService.resendMail(req.user.userId);
  }
}
