import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { QueryClientesDto } from './dto/query-clientes.dto';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClienteDto) {
    return this.prisma.cliente.create({ data });
  }

  async findAll(query: QueryClientesDto) {
    const { search, page = 1, limit = 20 } = query;

    const where = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' as any } },
            { cedula: { contains: search, mode: 'insensitive' as any } },
          ],
          deletedAt: null as any,
        }
      : { deletedAt: null as any };

    return this.prisma.cliente.findMany({
      where,
      include: {
        _count: {
          select: { polizas: true },
        },
      },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: { polizas: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.cliente.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}