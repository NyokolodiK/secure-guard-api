import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { User } from '@prisma/client';
import { UserType } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserType.SYSTEM_ADMIN, UserType.COMPANY_ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.SYSTEM_ADMIN, UserType.COMPANY_ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.id, updateUserDto);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.SYSTEM_ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserType.SYSTEM_ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // User preferences endpoints
  @Get('preferences/all')
  getUserPreferences(@CurrentUser() user: User) {
    return this.usersService.getUserPreferences(user.id);
  }

  @Post('preferences')
  setUserPreference(
    @CurrentUser() user: User,
    @Body() body: { key: string; value: string },
  ) {
    return this.usersService.setUserPreference(user.id, body.key, body.value);
  }

  @Delete('preferences/:key')
  deleteUserPreference(@CurrentUser() user: User, @Param('key') key: string) {
    return this.usersService.deleteUserPreference(user.id, key);
  }
}
