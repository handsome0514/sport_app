import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';

import { IJwtTokenData } from '../../auth/interfaces';
import { AuthModuleService } from '../../auth/services/auth-module.service';
import { UserDocument, UserRoles } from '../../user/schemas/user.schema';
import {
  CreateUserDto,
  GetUsersQueries,
  UpdateUserDto,
} from '../dtos/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
    private readonly authModuleService: AuthModuleService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(queries: GetUsersQueries) {
    const users = await this.userModel
      .find()
      .limit(queries.limit || 10)
      .skip((queries.limit || 10) * ((queries.page || 1) - 1))
      .select('-password -__v')
      .lean()
      .exec();

    const total = await this.userModel.countDocuments();

    return {
      users,
      total,
    };
  }

  async getUserById(_id: string) {
    let candidate: UserDocument;

    try {
      candidate = await this.userModel
        .findOne({ _id })
        .select('-password -__v')
        .lean()
        .exec();
    } catch (e) {
      throw new BadRequestException('Bad "_id" param');
    }

    if (!candidate) {
      throw new NotFoundException('User is not exists');
    }

    return candidate;
  }

  async createUser(user: IJwtTokenData, data: CreateUserDto) {
    // // Disable the ability to create other master administrators
    // if (data?.roles?.includes(UserRoles.MasterAdmin)) {
    //   throw new BadRequestException('Impossible to make master admin');
    // }

    // Allow make other admin only for master admin
    if (
      data.roles.includes(UserRoles.Admin) &&
      !user.roles.includes(UserRoles.MasterAdmin)
    ) {
      throw new BadRequestException('Only MasterAdmin can make other admins');
    }

    const newUser = await this.authModuleService.registration(data);

    await this.userModel.updateOne(
      {
        _id: newUser._id,
      },
      {
        ...data,
        email: data.user_email.toLowerCase(),
      },
    );

    return this.userModel
      .findOne({
        _id: newUser._id,
      })
      .lean();
  }

  async getAdminUsers(queries: GetUsersQueries) {
    return this.userModel
      .find({
        roles: {
          $in: [UserRoles.Admin, UserRoles.MasterAdmin],
        },
      })
      .limit(queries.limit || 10)
      .skip((queries.limit || 10) * ((queries.page || 1) - 1))
      .select('-password -__v')
      .lean();
  }

  async updateUser(user: IJwtTokenData, _id: string, data: UpdateUserDto) {
    // // Disable the ability to create other master administrators
    // if (data?.roles?.includes(UserRoles.MasterAdmin)) {
    //   throw new BadRequestException('Impossible to make master admin');
    // }

    // Allow make other admin only for master admin
    if (
      data.roles?.includes(UserRoles.Admin) &&
      !user.roles.includes(UserRoles.MasterAdmin)
    ) {
      throw new BadRequestException('Only MasterAdmin can make other admins');
    }

    // Check if user with that _id exists
    const candidate = await this.userModel.findOne({
      _id,
    });

    if (!candidate) {
      throw new BadRequestException('User not exists');
    }

    // Disable ability for regular admins to change canLogin property for other admins
    if (
      !user.roles.includes(UserRoles.MasterAdmin) &&
      !data.canLogin &&
      candidate?.roles?.includes(UserRoles.Admin)
    ) {
      throw new BadRequestException(
        'You can not change `canLogin` for other admins',
      );
    }

    // If password wants to change make a hash
    if (data.password) {
      data.password = bcryptjs.hashSync(
        data.password,
        this.configService.get('passwordSalt'),
      );
    }

    await this.userModel.updateOne(
      {
        _id: candidate._id,
      },
      data,
    );

    return this.userModel
      .findOne({
        _id: candidate._id,
      })
      .select('-password -__v')
      .lean();
  }
}
