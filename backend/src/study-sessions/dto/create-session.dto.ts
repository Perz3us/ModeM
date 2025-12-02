import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSessionDto {
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @IsInt()
  @IsNotEmpty()
  duration: number;

  @IsBoolean()
  @IsOptional()
  isPomodoro?: boolean;

  @IsInt()
  @IsOptional()
  subjectId?: number;
}
