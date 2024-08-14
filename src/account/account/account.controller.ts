import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { AuthenticationGuard } from '../../common/guards/authentication/authentication.guard';

@Controller('account')
@UseGuards(AuthenticationGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll(@Request() req) {
    return this.accountService.findOne(req.user.userId);
  }
}
