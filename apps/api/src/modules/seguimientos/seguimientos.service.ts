import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/prisma/prisma.service';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@Injectable()
export class SeguimientosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSeguimientoDto) {
    const { proximaLamada, ...resto } = data;
    return this.prisma.seguimiento.create({
      data: {
        ...resto,
        proximaLamada: proximaLamada ? new Date(proximaLamada) : undefined,
      },
      include: {
        poliza: {
          include: {
            cliente: true,
          },
        },
        usuario: true,
      },
    });
  }

  async findAllPorPoliza(polizaId: string) {
    return this.prisma.seguimiento.findMany({
      where: { polizaId },
      include: {
        usuario: {
          select: { nombre: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
