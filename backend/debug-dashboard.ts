import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DashboardService } from './src/dashboard/dashboard.service';
import { PrismaService } from './src/prisma/prisma.service';

async function bootstrap() {
  console.log('Initializing application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  try {
    const dashboardService = app.get(DashboardService);
    const prismaService = app.get(PrismaService);
    
    console.log('App context initialized.');

    // Find the test user
    const email = 'test3@example.com';
    console.log(`Finding user with email: ${email}...`);
    const user = await prismaService.user.findUnique({ where: { email } });

    if (!user) {
      console.error(`User ${email} not found! Listing first 5 users:`);
      const users = await prismaService.user.findMany({ take: 5 });
      console.log(users);
      return;
    }

    console.log(`User found: ID ${user.id}, Nickname: ${user.nickName}`);

    console.log('Calling dashboardService.getDashboardData...');
    const startTime = Date.now();
    
    const data = await dashboardService.getDashboardData(user.id);
    
    const duration = Date.now() - startTime;
    console.log(`Command finished in ${duration}ms`);
    console.log('Dashboard Data:', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
