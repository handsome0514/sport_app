import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserSchema } from './schemas/user.schema';
import { UserPictureSchema } from './schemas/user-picture.schema';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'user-pictures', schema: UserPictureSchema },
    ]),
  ],
  exports: [
    UserService,
    MongooseModule.forFeature([
      { name: 'users', schema: UserSchema },
      { name: 'user-pictures', schema: UserPictureSchema },
    ]),
  ],
})
export class UserModule {}
