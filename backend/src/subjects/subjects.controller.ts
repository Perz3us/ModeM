import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
export class SubjectsController {
  constructor(private readonly subjectService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto, @Request() req) {
    return this.subjectService.create(createSubjectDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('includeArchived') includeArchived?: string) {
    return this.subjectService.findAll(req.user.id, includeArchived === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    // using +id here string is converted to number
    return this.subjectService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
    @Request() req,
  ) {
    return this.subjectService.update(+id, updateSubjectDto, req.user.id);
  }

  @Patch(':id/archive')
  archive(@Param('id') id: string, @Request() req) {
    return this.subjectService.archive(+id, req.user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Request() req,
    @Query('deleteAll') deleteAll?: string,
  ) {
    return this.subjectService.remove(+id, req.user.id, deleteAll === 'true');
  }
}
