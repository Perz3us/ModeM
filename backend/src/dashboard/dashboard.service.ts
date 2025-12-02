import { Injectable } from '@nestjs/common';
import { ProgressService } from '../progress/progress.service';
import { TaskService } from '../task/task.service';
import { RemindersService } from '../reminders/reminders.service';
import { Priority } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(
    private readonly progressService: ProgressService,
    private readonly taskService: TaskService,
    private readonly remindersService: RemindersService,
  ) {}

  async getDashboardData(userId: number) {
    // 1. Get Stats (Focus Time, Tasks Done, Streak)
    const stats = await this.progressService.getStats(userId);

    // 2. Get Today's Tasks
    const allTasks = await this.taskService.findAll(userId, {
      subjectId: undefined,
      dueSoon: false,
      isCompleted: false, // Only show pending tasks
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysTasks = allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate < tomorrow;
    });

    // 3. Get Upcoming Reminders
    const reminders = await this.remindersService.findAll(userId);
    const upcomingReminders = reminders
      .filter((r) => new Date(r.reminderTime) > new Date())
      .sort((a, b) => new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime())
      .slice(0, 5); // Get next 5 reminders

    return {
      focusTime: stats.totalStudyTimeSeconds,
      tasksDone: stats.tasksCompleted,
      streak: stats.streak,
      todaysTasks: todaysTasks.slice(0, 5), // Limit to 5
      upcomingReminders,
    };
  }
}
