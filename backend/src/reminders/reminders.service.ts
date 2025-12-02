import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createReminderDto: CreateReminderDto) {
    return this.prisma.reminder.create({
      data: {
        ...createReminderDto,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.reminder.findMany({
      where: { userId },
      include: { subject: true },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.reminder.findFirst({
      where: { id, userId },
      include: { subject: true },
    });
  }

  update(id: number, userId: number, updateReminderDto: UpdateReminderDto) {
    return this.prisma.reminder.updateMany({
      where: { id, userId },
      data: updateReminderDto,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.reminder.deleteMany({
      where: { id, userId },
    });
  }
}
