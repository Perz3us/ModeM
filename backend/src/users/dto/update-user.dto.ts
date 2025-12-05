import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @MinLength(2)
  nickName: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6)
  oldPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class UpdateMobileNumberDto {
  @IsString()
  @MinLength(10)
  mobileNumber: string;
}
