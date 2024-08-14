import { Module } from '@nestjs/common';
import { AccountModule as SubAccountModule } from './account/account.module';

@Module({
  imports: [SubAccountModule],
})
export class AccountModule {}
