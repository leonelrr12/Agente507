import { PrismaModule } from './prisma/prisma.module';
import {  Module } from '@nestjs/common';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}