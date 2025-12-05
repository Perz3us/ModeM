import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('study-sessions')
@UseGuards(JwtAuthGuard)
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @Post()
  create(@Request() req, @Body() createSessionDto: CreateSessionDto) {
    return this.studySessionsService.create(req.user.id, createSessionDto);
  }

  @Get()
  @Get()
  findAll(@Request() req, @Query('page') page: string = '1', @Query('limit') limit: string = '10') {
    return this.studySessionsService.findAll(req.user.id, +page, +limit);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.studySessionsService.findOne(+id, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.studySessionsService.remove(+id, req.user.id);
  }
}
