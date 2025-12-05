import { Priority } from '@prisma/client';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto, UpdateTaskDto } from './dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class TaskService {
  constructor(
    private prismaService: PrismaService,
    private badgesService: BadgesService,
  ) {}

  // ... (existing create method)

  async toggleComplete(id: number, userId: number) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }
    
    const updatedTask = await this.prismaService.task.update({
      where: { id },
      data: { isCompleted: !task.isCompleted },
    });

    if (updatedTask.isCompleted) {
      await this.badgesService.checkAndAwardBadges(userId, 'TASK_COMPLETED');
    }

    return updatedTask;
  }

  async create(createTaskDto: CreateTaskDto, userId: number) {
    if (createTaskDto.subjectId) {
      const subject = await this.prismaService.subject.findUnique({
        where: { id: createTaskDto.subjectId, userId: userId },
      });

      if (!subject) {
        throw new ForbiddenException('Subject not found or access denied');
      }
    }

    return this.prismaService.task.create({
      data: {
        ...createTaskDto,
        userId: userId,
        dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : null,
        priority: createTaskDto.priority
          ? createTaskDto.priority
          : Priority.MEDIUM,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(
    userId: number,
    filters: {
      subjectId?: number;
      priority?: Priority;
      isCompleted?: boolean;
      dueSoon?: boolean;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (filters.subjectId) where.SubjectId = filters.subjectId;
    if (filters.isCompleted !== undefined)
      where.isCompleted = filters.isCompleted;
    if (filters.priority) where.priority = filters.priority;

    if (filters.dueSoon) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.dueDate = { lte: tomorrow, gte: new Date() };
    }

    return this.prismaService.task.findMany({
      where,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isCompleted: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return task;
  }

  async update(id: number, userId: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return this.prismaService.task.update({
      where: { id },
      data: {
        ...updateTaskDto,
        dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : null,
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }



  async remove(id: number, userId: number) {
    const task = await this.prismaService.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found or access denied');
    }

    return this.prismaService.task.delete({
      where: { id },
    });
  }

  async getTaskStatistics(userId: number, subjectId?: number) {
    const where: any = { userId };
    if (subjectId) where.subjectId = subjectId;
    const [total, completed, overdue] = await Promise.all([
      this.prismaService.task.count({ where }),
      this.prismaService.task.count({ where: { ...where, isCompleted: true } }),
      this.prismaService.task.count({
        where: { ...where, isCompleted: false, dueDate: { lt: new Date() } },
      }),
    ]);
    return {
      total,
      completed,
      pending: total - completed,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}
