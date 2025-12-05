import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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

  @Cron(CronExpression.EVERY_MINUTE)
  async checkUpcomingReminders() {
    const now = new Date();
    // Align to the start of the current minute to ensure consistent windows
    now.setSeconds(0, 0);

    const whatsappServiceUrl = this.configService.get<string>('WHATSAPP_SERVICE');
    if (!whatsappServiceUrl) {
      console.warn('WHATSAPP_SERVICE env variable is not set. Skipping notifications.');
      return;
    }

    const applicationName = this.configService.get<string>('APPLICATION_NAME');
    if (!applicationName) {
      console.warn('APPLICATION_NAME env variable is not set. Skipping notifications.');
      return;
    }

    const intervals = [
      { label: '10 minutes', ms: 10 * 60 * 1000 },
      { label: '1 hour', ms: 60 * 60 * 1000 },
      { label: '1 day', ms: 24 * 60 * 60 * 1000 },
    ];

    for (const interval of intervals) {
      const targetTimeStart = new Date(now.getTime() + interval.ms);
      const targetTimeEnd = new Date(targetTimeStart.getTime() + 60 * 1000); // 1 minute window

      const dueReminders = await this.prisma.reminder.findMany({
        where: {
          reminderTime: {
            gte: targetTimeStart,
            lt: targetTimeEnd,
          },
        },
        include: {
          user: true,
        },
      });

      for (const reminder of dueReminders) {
        if (reminder.user.mobileNumber) {
          try {
            await this.httpService.axiosRef.post(`${whatsappServiceUrl}/send-message`, {
              mobileNumber: reminder.user.mobileNumber,
              message: `${applicationName} Your Reminder: "${reminder.title}" is coming up in ${interval.label} (at ${new Date(reminder.reminderTime).toLocaleTimeString()})!`,
            });
            console.log(`Sent ${interval.label} notification for reminder: ${reminder.id}`);
          } catch (error) {
            console.error(`Failed to send ${interval.label} notification for reminder ${reminder.id}`, error.message);
          }
        }
      }
    }
  }
}
