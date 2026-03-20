import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { ClientesModule } from '@/modules/clientes/clientes.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    ClientesModule,
    AuthModule
  ],
})
export class AppModule { }