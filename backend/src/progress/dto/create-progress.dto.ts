import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  @IsNotEmpty()
  period: string;

  @IsInt()
  @IsNotEmpty()
  tasksCompleted: number;

  @IsInt()
  @IsNotEmpty()
  timeSpent: number;

  @IsInt()
  @IsNotEmpty()
  goalsAchieved: number;

  @IsInt()
  @IsOptional()
  subjectId?: number;
}
