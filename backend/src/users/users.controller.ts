import { Body, Controller, Patch, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ChangePasswordDto, UpdateNicknameDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Patch('nickname')
  updateNickname(@Request() req, @Body() dto: UpdateNicknameDto) {
    return this.usersService.updateNickname(req.user.id, dto.nickName);
  }

  @Patch('password')
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
  }
}
