import { PrismaModule } from './prisma.module';
import {  Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}