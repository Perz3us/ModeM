import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProgressModule } from '../progress/progress.module';
import { TaskModule } from '../task/task.module';
import { RemindersModule } from '../reminders/reminders.module';

@Module({
  imports: [ProgressModule, TaskModule, RemindersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
