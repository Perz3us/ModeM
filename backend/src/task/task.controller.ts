import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Priority } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.taskService.create(createTaskDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('subjectId', new ParseIntPipe({ optional: true }))
    subjectId: number,
    @Query('dueSoon') dueSoon: boolean,
    @Query('priority') priority?: Priority,
    @Query('isCompleted') isCompleted?: boolean,
  ) {
    const filters = { subjectId, priority, isCompleted, dueSoon };
    return this.taskService.findAll(req.user.id, filters);
  }

  @Get('statistics')
  getStatistics(
    @Request() req,
    @Query('subjectId', new ParseIntPipe({ optional: true }))
    subjectId?: number,
  ) {
    return this.taskService.getTaskStatistics(req.user.id, subjectId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.taskService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, req.user.id, updateTaskDto);
  }

  @Patch(':id/toggle')
  toggleComplete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.taskService.toggleComplete(id, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.taskService.remove(id, req.user.id);
  }
}
