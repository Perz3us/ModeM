import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  create(@Request() req, @Body() createProgressDto: CreateProgressDto) {
    return this.progressService.create(req.user.id, createProgressDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.progressService.findAll(req.user.id);
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.progressService.getStats(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.progressService.findOne(+id, req.user.id);
  }
}
