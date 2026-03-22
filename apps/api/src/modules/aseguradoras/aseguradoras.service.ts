import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/prisma/prisma.service';

@Injectable()
export class AseguradorasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.aseguradora.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  async create(data: { nombre: string }) {
    return this.prisma.aseguradora.create({ data });
  }
}
