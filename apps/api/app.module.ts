import {  Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthController } from '@/modules/health/health.controller';
import { HealthModule } from '@/modules/health/health.module';
import { ClientesModule } from '@/modules/clientes/clientes.module';

@Module({
  imports: [ 
    PrismaModule,
    HealthModule,
    ClientesModule
  ],
})
export class AppModule {}