import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';

import { UserDocument } from '../../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, inputPassword: string) {
    const user = await this.userModel
      .findOne({
        email: email.toLowerCase(),
      })
      .lean();

    if (user && bcryptjs.compareSync(inputPassword, user.password)) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }
}
