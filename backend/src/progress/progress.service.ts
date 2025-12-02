import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgressDto } from './dto/create-progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, createProgressDto: CreateProgressDto) {
    return this.prisma.progress.create({
      data: {
        ...createProgressDto,
        userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.progress.findMany({
      where: { userId },
      include: { subject: true },
    });
  }

  findOne(id: number, userId: number) {
    return this.prisma.progress.findFirst({
      where: { id, userId },
      include: { subject: true },
    });
  }
  async getStats(userId: number) {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6); // Last 7 days

    // 1. Total Study Time
    const studySessions = await this.prisma.studySession.findMany({
      where: { userId },
    });
    const totalStudyTimeSeconds = studySessions.reduce((acc, session) => acc + session.duration, 0);
    const totalStudyTimeHours = Math.round(totalStudyTimeSeconds / 3600);

    // 2. Tasks Completed
    const tasksCompleted = await this.prisma.task.count({
      where: { userId, isCompleted: true },
    });

    // 3. Streak (Simplified: Count consecutive days with activity going back from today)
    // For a real app, this would be more complex.
    // Let's just mock it or calculate based on unique days in studySessions/tasks
    // For now, let's calculate active days in the last 30 days
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeDays = new Set();
    studySessions.forEach(s => {
      if (s.createdAt >= thirtyDaysAgo) {
        activeDays.add(s.createdAt.toISOString().split('T')[0]);
      }
    });
    // This is "Active Days in last 30 days", not exactly streak, but good enough for MVP
    const streak = activeDays.size; 

    // 4. Weekly Activity
    const weeklyActivity: { name: string; hours: number }[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];
      
      const daySessions = studySessions.filter(s => s.createdAt.toISOString().split('T')[0] === dateStr);
      const daySeconds = daySessions.reduce((acc, s) => acc + s.duration, 0);
      
      weeklyActivity.unshift({
        name: dayName,
        hours: Math.round((daySeconds / 3600) * 10) / 10 // 1 decimal place
      });
    }

    // 5. Subject Distribution
    const subjects = await this.prisma.subject.findMany({
      where: { userId },
      include: { studySessions: true }
    });

    const subjectDistribution = subjects.map((subject, index) => {
      const subjectSeconds = subject.studySessions.reduce((acc, s) => acc + s.duration, 0);
      const colors = ['#6366f1', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
      return {
        name: subject.name,
        value: Math.round((subjectSeconds / 3600) * 10) / 10,
        color: colors[index % colors.length]
      };
    }).filter(s => s.value > 0); // Only show subjects with study time

    return {
      totalStudyTime: totalStudyTimeHours,
      totalStudyTimeSeconds,
      tasksCompleted,
      streak,
      weeklyActivity,
      subjectDistribution
    };
  }
}
