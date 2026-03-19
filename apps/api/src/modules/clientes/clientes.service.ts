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
    return this.prisma.cliente.findMany({
      where: {
        nombre: {
          contains: query.search,
          mode: 'insensitive',
        },
      },
      take: Number(query.limit) || 20,
      skip: ((query.page || 1) - 1) * (query.limit || 20),
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