import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Database connected successfully');
      })
      .catch((err) => {
        console.error('Database connection error:', err);
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Database connection closed');
  }
}
