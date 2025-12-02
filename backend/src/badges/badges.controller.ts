import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BadgesService } from './badges.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('badges')
@UseGuards(JwtAuthGuard)
export class BadgesController {
  constructor(private readonly badgesService: BadgesService) {}



  @Get()
  findAll(@Request() req) {
    return this.badgesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.badgesService.findOne(+id, req.user.id);
  }
}
