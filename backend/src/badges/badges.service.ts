import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBadgeDto } from './dto/create-badge.dto';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async checkAndAwardBadges(userId: number, event: 'SESSION_COMPLETED' | 'TASK_COMPLETED') {
    const badges: { name: string; description: string }[] = [];

    // 1. First Steps: Complete your first study session
    if (event === 'SESSION_COMPLETED') {
      const sessionCount = await this.prisma.studySession.count({ where: { userId } });
      if (sessionCount >= 1) {
        badges.push({
          name: 'First Steps',
          description: 'Completed your first study session',
        });
      }

      // 2. Focus Master: Complete 10 study sessions
      if (sessionCount >= 10) {
        badges.push({
          name: 'Focus Master',
          description: 'Completed 10 study sessions',
        });
      }

      // 4. Night Owl: Study between 10 PM and 4 AM
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 22 || hour < 4) {
        // Check if they already have it to avoid duplicates (optional, but good practice)
        const hasBadge = await this.prisma.badge.findFirst({
          where: { userId, name: 'Night Owl' },
        });
        if (!hasBadge) {
          badges.push({
            name: 'Night Owl',
            description: 'Completed a study session late at night',
          });
        }
      }
    }

    // 3. Task Crusher: Complete 5 tasks
    if (event === 'TASK_COMPLETED') {
      const taskCount = await this.prisma.task.count({ where: { userId, isCompleted: true } });
      if (taskCount >= 5) {
        badges.push({
          name: 'Task Crusher',
          description: 'Completed 5 tasks',
        });
      }
    }

    // Award badges
    for (const badge of badges) {
      // Double check existence to be safe
      const exists = await this.prisma.badge.findFirst({
        where: { userId, name: badge.name },
      });

      if (!exists) {
        await this.prisma.badge.create({
          data: {
            userId,
            name: badge.name,
            description: badge.description,
          },
        });
      }
    }
  }

  findAll(userId: number) {
    return this.prisma.badge.findMany({
      where: { userId },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.badge.findFirst({
      where: { id, userId },
    });
  }
}
