import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        userType: true,
        companyId: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        userType: true,
        companyId: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: {
            id: true,
            name: true,
            logoUrl: true,
            description: true,
            verified: true,
          },
        },
        userPreferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        profileImageUrl: true,
        userType: true,
        companyId: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }

  // User preferences methods
  async getUserPreferences(userId: string) {
    return this.prisma.userPreference.findMany({
      where: { userId },
    });
  }

  async setUserPreference(userId: string, key: string, value: string) {
    return this.prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
      update: { value },
      create: {
        userId,
        key,
        value,
      },
    });
  }

  async deleteUserPreference(userId: string, key: string) {
    return this.prisma.userPreference.delete({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    });
  }
}
