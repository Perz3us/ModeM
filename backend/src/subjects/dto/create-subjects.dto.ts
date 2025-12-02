import { IsInt, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MinLength(1, { message: 'Subject name is required ' })
  name: string;

  @IsOptional()
  @IsInt()
  parentId?: number;
}
