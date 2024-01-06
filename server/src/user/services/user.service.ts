import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as imageSize from 'buffer-image-size';
import imageType from 'image-type';
import { Model, Types } from 'mongoose';
import * as sharp from 'sharp';

import { UpdateOwnUserDto } from '../../auth/dtos/auth.dto';
import { IJwtTokenData } from '../../auth/interfaces';
import { UserDocument } from '../schemas/user.schema';
import { UserPictureDocument } from '../schemas/user-picture.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<UserDocument>,
    @InjectModel('user-pictures')
    private readonly userPictureModel: Model<UserPictureDocument>,
  ) {}

  async updateUser(user: IJwtTokenData, data: UpdateOwnUserDto) {
    let candidate: UserDocument;

    try {
      candidate = await this.userModel.findOne({
        _id: user._id,
      });
    } catch (e) {
      throw new BadRequestException('User not found');
    }

    if (!candidate) {
      throw new BadRequestException('User not found');
    }

    if (data.email) {
      const emailCandidate = await this.userModel.findOne({
        email: data.email,
      });

      if (
        emailCandidate &&
        emailCandidate._id.toString() !== candidate._id.toString()
      ) {
        throw new BadRequestException('Email already registered');
      }
    }

    if (data.nickname) {
      const nicknameCandidate = await this.userModel.findOne({
        nickname: data.nickname,
      });

      if (
        nicknameCandidate &&
        nicknameCandidate._id.toString() !== candidate._id.toString()
      ) {
        throw new BadRequestException('Nickname already in use');
      }
    }

    if (data.phone) {
      const phoneNumberCandidate = await this.userModel.findOne({
        phone: data.phone,
      });

      if (
        phoneNumberCandidate &&
        phoneNumberCandidate._id.toString() !== candidate._id.toString()
      ) {
        throw new BadRequestException('Phone number already taken');
      }
    }

    await this.userModel.updateOne(
      {
        _id: candidate._id,
      },
      data,
    );
  }

  async getUser(_id: string) {
    if (!Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }

    const candidate = await this.userModel
      .findOne({
        _id,
      })
      .select('-password -__v')
      .lean();

    if (!candidate) {
      throw new BadRequestException('No user found');
    }

    return {
      ...candidate,
      atpStanding: candidate.atpStanding || 0,
      playedGames: candidate.playedGames || 0,
      wins: candidate.wins || 0,
      trophies: candidate.trophies || 0,
      name: candidate.name,
    };
  }

  async getPicture(_id: string) {
    if (!Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Invalid id');
    }

    const candidate = await this.userModel.findOne({
      _id,
    });

    if (!candidate?.pictureId) {
      throw new NotFoundException('No picture found');
    }

    const picture = await this.userPictureModel.findOne({
      _id: candidate.pictureId,
    });

    if (!picture) {
      throw new BadRequestException('No picture found');
    }

    return picture;
  }

  async patchUserPicture({
    _id,
    picture,
  }: { _id: string } & { picture: Express.Multer.File }) {
    const candidate = await this.userModel.findOne({
      _id,
    });

    let pictureBuffer: Buffer = picture.buffer;

    // Check picture type
    const pictureType = await imageType(pictureBuffer);

    if (!pictureType) {
      throw new BadRequestException(
        'Image validation failed (accepted type are /^(jpg|jpeg|png|heif)$/)',
      );
    }

    if (!pictureType.ext.match(/(jpg|jpeg|png|heif)$/)) {
      throw new BadRequestException(
        'Image validation failed (accepted type are /^(jpg|jpeg|png|heif)$/)',
      );
    }

    // Check picture size
    const { width, height } = imageSize(pictureBuffer);

    if (width > 100 || height > 100) {
      pictureBuffer = await sharp(picture.buffer)
        .resize(50, 50)
        .jpeg({ mozjpeg: true })
        .toBuffer();
    }

    // Create or update picture
    if (candidate?.pictureId) {
      await this.userPictureModel.updateOne(
        {
          _id: candidate.pictureId,
        },
        {
          picture: pictureBuffer,
        },
      );
    } else {
      const newPicture = await this.userPictureModel.create({
        picture: pictureBuffer,
      });

      await this.userModel.updateOne(
        {
          _id: candidate._id,
        },
        {
          pictureId: newPicture._id,
        },
      );
    }
  }

  async deletePicture(_id: string) {
    const candidate = await this.userModel.findOne({
      _id,
    });

    if (!candidate?.pictureId) {
      throw new NotFoundException('No picture found');
    }

    await this.userModel.updateOne(
      {
        _id,
      },
      {
        pictureId: null,
      },
    );

    await this.userPictureModel.deleteOne({ _id: candidate.pictureId });
  }
}
