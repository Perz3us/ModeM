import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SubjectsModule } from './subjects/subjects.module';
import { TaskModule } from './task/task.module';
import { NotesModule } from './notes/notes.module';
import { RemindersModule } from './reminders/reminders.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { BadgesModule } from './badges/badges.module';
import { ProgressModule } from './progress/progress.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60,
      },
    ]),
    SubjectsModule,
    TaskModule,
    NotesModule,
    RemindersModule,
    StudySessionsModule,
    BadgesModule,
    ProgressModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor() {}
  onModuleInit() {
    console.log('Module initialized');
  }
}
