import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Request() req, @Body() createReminderDto: CreateReminderDto) {
    return this.remindersService.create(req.user.sub, createReminderDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.remindersService.findAll(req.user.sub);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.remindersService.findOne(+id, req.user.sub);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateReminderDto: UpdateReminderDto) {
    return this.remindersService.update(+id, req.user.sub, updateReminderDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.remindersService.remove(+id, req.user.sub);
  }
}
