import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles, RolesGuard } from '../auth/guards/roles.guard';
import { ProtectedRequest } from '../auth/interfaces/protected-request.interface';
import { UserDto } from '../user/dtos/user.dto';
import { UserRoles } from '../user/schemas/user.schema';
import {
  CreateUserDto,
  GetAdminUsersResponseDto,
  GetUsersQueries,
  GetUsersResponseDto,
  UpdateUserDto,
} from './dtos/admin.dto';
import { AdminService } from './services/admin.service';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'Get users',
    description: 'Get users',
  })
  @ApiOkResponse({
    description: 'Users received successfully',
    type: UserDto,
    isArray: true,
  })
  @ApiForbiddenResponse({ description: 'You do not have Admin rights' })
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @ApiBearerAuth('Bearer')
  @Get('user')
  async getUsers(@Query() queries: GetUsersQueries) {
    return this.adminService.getUsers(queries);
  }

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user by ID',
  })
  @ApiOkResponse({ description: 'User got successfully', type: UserDto })
  @ApiNotFoundResponse({ description: 'User is not exists' })
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @Get('user/:_id')
  async getUserById(
    @Query() queries: GetUsersQueries,
    @Param('_id') _id: string,
  ) {
    return this.adminService.getUserById(_id);
  }

  @ApiOperation({
    summary: 'Create user',
    description: 'Create user',
  })
  @ApiOkResponse({
    description: 'User created successfully',
    type: GetUsersResponseDto,
  })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @Post('user')
  async createUser(@Req() req: ProtectedRequest, @Body() data: CreateUserDto) {
    const { password, ...newUser } = await this.adminService.createUser(
      req.user,
      data,
    );

    return newUser;
  }

  @ApiOperation({
    summary: 'Get admin users',
    description: 'Get admin users',
  })
  @ApiOkResponse({
    description: 'Admins got successfully',
    type: GetAdminUsersResponseDto,
    isArray: true,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @Get('admin-users')
  async getAdminUsers(@Query() queries: GetUsersQueries) {
    return this.adminService.getAdminUsers(queries);
  }

  @ApiOperation({
    summary: 'Update user',
    description: 'Update user',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserDto,
  })
  @ApiBearerAuth('Bearer')
  @Roles([UserRoles.Admin])
  @UseGuards(RolesGuard)
  @Patch('user/:_id')
  async updateUser(
    @Req() req: ProtectedRequest,
    @Param('_id') _id: string,
    @Body() data: UpdateUserDto,
  ) {
    const { password, ...updatedUser } = await this.adminService.updateUser(
      req.user,
      _id,
      data,
    );

    return updatedUser;
  }
}
