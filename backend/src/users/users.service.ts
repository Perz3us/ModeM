import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateNickname(userId: number, nickName: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { nickName },
      select: { id: true, email: true, nickName: true },
    });
    return user;
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordValid = await argon2.verify(user.password, oldPassword);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async updateMobileNumber(userId: number, mobileNumber: string) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { mobileNumber },
      select: { id: true, email: true, mobileNumber: true },
    });
    return user;
  }
}
