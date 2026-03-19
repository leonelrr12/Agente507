import { MoraUtils } from '@/config/config.service';
import { Injectable } from '@nestjs/common';
import { NivelMora } from '@prisma/client';
import { PrismaService } from 'apps/api/prisma/prisma.service';

@Injectable()
export class PolizasService {
  constructor(private prisma: PrismaService) {}

  async findPorVencer(dias: number) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);

    return this.prisma.poliza.findMany({
      where: {
        fechaVencimiento: {
          lte: fecha,
        },
      },
      include: {
        cliente: true,
      },
    });
  }

  async findEnMora(nivel: string) {
    return this.prisma.poliza.findMany({
      where: {
        mora: {
          nivelRiesgo: NivelMora.LEVE,
        },
      },
      include: {
        cliente: true,
        mora: true,
      },
    });
  }
}