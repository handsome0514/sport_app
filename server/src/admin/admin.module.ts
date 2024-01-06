import { forwardRef, Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { AdminController } from './admin.controller';
import { AdminService } from './services/admin.service';

@Module({
  providers: [AdminService],
  controllers: [AdminController],
  imports: [UserModule, forwardRef(() => AuthModule)],
  exports: [AdminService],
})
export class AdminModule {}
