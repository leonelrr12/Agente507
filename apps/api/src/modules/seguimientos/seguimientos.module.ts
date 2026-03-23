import { Module } from '@nestjs/common';
import { SeguimientosController } from './seguimientos.controller';
import { SeguimientosService } from './seguimientos.service';
import { PrismaModule } from 'apps/api/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeguimientosController],
  providers: [SeguimientosService],
})
export class SeguimientosModule {}
