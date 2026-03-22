import { Module } from '@nestjs/common';
import { AseguradorasService } from './aseguradoras.service';
import { AseguradorasController } from './aseguradoras.controller';
import { PrismaModule } from 'apps/api/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AseguradorasService],
  controllers: [AseguradorasController],
  exports: [AseguradorasService],
})
export class AseguradorasModule {}
