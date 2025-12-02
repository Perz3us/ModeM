import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

export
@Controller()
class AppController {
  constructor(private prisma: PrismaService) {}

  @Get('db-test')
  async testDatabaseConnection() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        error: error.message,
      };
    }
  }
}
