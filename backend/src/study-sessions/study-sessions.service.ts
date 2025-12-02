import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { BadgesService } from '../badges/badges.service';

@Injectable()
export class StudySessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly badgesService: BadgesService,
  ) {}

  async create(userId: number, createSessionDto: CreateSessionDto) {
    const session = await this.prisma.studySession.create({
      data: {
        startTime: new Date(createSessionDto.startTime),
        duration: createSessionDto.duration,
        isPomodoro: createSessionDto.isPomodoro,
        subjectId: createSessionDto.subjectId,
        userId,
      },
    });

    await this.badgesService.checkAndAwardBadges(userId, 'SESSION_COMPLETED');

    return session;
  }

  findAll(userId: number) {
    return this.prisma.studySession.findMany({
      where: { userId },
      include: { subject: true },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.studySession.findFirst({
      where: { id, userId },
      include: { subject: true },
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.studySession.deleteMany({
      where: { id, userId },
    });
  }
}
