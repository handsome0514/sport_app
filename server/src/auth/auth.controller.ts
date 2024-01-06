import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import imageType from 'image-type';

import { GetCookies } from '../shared/decorators/get-cookie.decorator';
import { PatchUserPictureDto } from '../user/dtos/user.dto';
import { UserService } from '../user/services/user.service';
import {
  GetUserDataResponseDto,
  LogInDto,
  LoginResponseDto,
  RefreshResponseDto,
  RegisterDto,
  UpdateOwnUserDto,
  UpdateOwnUserResponseDto,
  UserActivationResponseDto,
} from './dtos/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ProtectedRequest } from './interfaces/protected-request.interface';
import { AuthModuleService } from './services/auth-module.service';

@ApiTags('Auth')
@Controller('user')
export class AuthController {
  constructor(
    private readonly authModuleService: AuthModuleService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({
    summary: 'Register new user',
    description: 'Register new user',
  })
  @ApiCreatedResponse({
    description: 'User registerd successfully',
  })
  @ApiBadRequestResponse({
    description: 'Email already exists',
  })
  @Post('registration')
  async register(@Body() body: RegisterDto) {
    await this.authModuleService.registration(body);
  }

  @ApiOperation({
    summary: 'Log-in user',
    description: 'Log-in user',
  })
  @ApiOkResponse({
    description: 'Logged in successfully',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async logIn(@Res() res: Response, @Body() body: LogInDto) {
    const data = await this.authModuleService.logIn(body);

    res.cookie('refreshToken', data.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
    });

    res.json({
      accessToken: data.accessToken,
      user: data.user,
    });
  }

  @ApiOperation({
    summary: 'Log out',
    description: 'Log out',
  })
  @ApiCreatedResponse({
    description: 'User logged out successfully',
  })
  @Post('logout')
  async logOut(
    @Res() res: Response,
    @GetCookies('refreshToken') refreshToken: string,
  ) {
    await this.authModuleService.logOut(refreshToken);

    res.clearCookie('refreshToken');

    res.sendStatus(HttpStatus.CREATED);
  }

  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Refresh tokens',
  })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: RefreshResponseDto,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('refresh')
  async refresh(
    @Res() res: Response,
    @GetCookies('refreshToken') refreshToken: string,
  ) {
    const data = await this.authModuleService.refresh(refreshToken);

    res.cookie('refreshToken', data.refreshToken, {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
    });

    res.json({
      accessToken: data.accessToken,
      user: data.user,
    });
  }

  @ApiOperation({
    summary: 'Update own user data',
    description: 'Update own user data',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UpdateOwnUserResponseDto,
  })
  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateUser(
    @Req() req: ProtectedRequest,
    @Body() data: UpdateOwnUserDto,
  ) {
    return this.userService.updateUser(req.user, data);
  }

  @ApiOperation({
    summary: 'Activate user',
    description: 'Activate user',
  })
  @ApiOkResponse({
    description: 'User activated successfully',
    type: UserActivationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid activation link',
  })
  @Get('activate')
  async activate(@Query('link') link: string) {
    await this.authModuleService.activate(link);

    return { message: 'Account activated' };
  }

  // @ApiOperation({
  //   summary: 'Request password change',
  //   description: 'Request password change',
  // })
  // @ApiOkResponse({
  //   description: 'Request to reset password created successfully',
  //   type: ForgotPasswordResponseDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'User with this email is not registered',
  // })
  // @Post('forgot-password')
  // async forgotPassword(@Body() data: ForgotPasswordDto) {
  //   await this.authModuleService.forgotPassword(data);
  //
  //   return { message: 'Check your email' };
  // }
  //
  // @ApiOperation({
  //   summary: 'Reset password',
  //   description: 'Reset password',
  // })
  // @ApiOkResponse({
  //   description: 'Password changes successfully',
  //   type: ResetPasswordResponseDto,
  // })
  // @ApiBadRequestResponse({
  //   description: 'User with this email is not registered',
  // })
  // @Post('reset-password')
  // async resetPassword(@Body() data: ResetPasswordDto) {
  //   await this.authModuleService.resetPassword(data);
  //
  //   return { message: 'Success' };
  // }

  @ApiOperation({ description: 'Get user data' })
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({
    description: 'Successfully received user data',
    type: GetUserDataResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not exists',
  })
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getOwnUserData(@Req() req: ProtectedRequest) {
    return this.userService.getUser(req.user._id);
  }

  @ApiOperation({ description: 'Get user data' })
  @ApiOkResponse({
    description: 'Successfully received user data',
    type: GetUserDataResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not exists',
  })
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @ApiOperation({ description: 'Get user picture' })
  @ApiOkResponse({ description: 'Picture found and got successfully' })
  @ApiNotFoundResponse({ description: 'Picture not found' })
  @ApiParam({ name: 'id', description: 'Picture ID' })
  @Get(':id/picture')
  async getPicture(@Param('id') id: string, @Res() res: Response) {
    const { picture } = await this.userService.getPicture(id);

    const { mime } = await imageType(picture);

    res.type(mime);
    res.send(picture);
  }

  @ApiOperation({ description: 'Patch user picture' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth('Bearer')
  @ApiOkResponse({ description: 'Picture updates successfully' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({
    description: 'Validation failed (expected type is /^(jpg|jpeg|png|heif)$/)',
  })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @UseInterceptors(FileInterceptor('picture'))
  @UseGuards(JwtAuthGuard)
  @Patch('picture')
  async patchPicture(
    @Body() data: PatchUserPictureDto,
    @Req() req: ProtectedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|heif)$/ }),
        ],
      }),
    )
    picture: Express.Multer.File,
  ) {
    await this.userService.patchUserPicture({
      _id: req.user._id,
      picture,
    });
  }

  @ApiOkResponse({ description: 'Picture deleted successfully' })
  @ApiBearerAuth('Bearer')
  @ApiNotFoundResponse({ description: 'Picture not exists' })
  @ApiUnauthorizedResponse({ description: 'User unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('picture')
  async deletePicture(@Req() req: ProtectedRequest) {
    await this.userService.deletePicture(req.user._id);
  }
}
