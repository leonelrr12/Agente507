import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@Injectable()
export class SeguimientosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSeguimientoDto) {
    const { proximaAccion, ...resto } = data;
    return this.prisma.seguimiento.create({
      data: {
        ...resto,
        proximaAccion: proximaAccion ? new Date(proximaAccion) : undefined,
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
