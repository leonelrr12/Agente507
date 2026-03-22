import { Injectable } from '@nestjs/common';
import { NivelMora } from '@prisma/client';
import { PrismaService } from 'apps/api/prisma/prisma.service';
import { CreatePolizaDto } from './dto/create-poliza.dto';
import { UpdatePolizaDto } from './dto/update-poliza.dto';

@Injectable()
export class PolizasService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePolizaDto) {
    const { fechaVencimiento, fechaInicio, ...resto } = data;
    return this.prisma.poliza.create({
      data: {
        ...resto,
        fechaVencimiento: new Date(fechaVencimiento),
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
      },
      include: {
        cliente: true,
        aseguradora: true,
      },
    });
  }

  async findAll() {
    return this.prisma.poliza.findMany({
      where: { deletedAt: null as any },
      include: {
        cliente: true,
        aseguradora: true,
        _count: {
          select: { seguimientos: true },
        },
      },
      orderBy: { fechaVencimiento: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.poliza.findUnique({
      where: { id },
      include: {
        cliente: true,
        aseguradora: true,
        seguimientos: true,
        mora: true,
      },
    });
  }

  async findPorVencer(dias: number) {
    const fechaLimit = new Date();
    fechaLimit.setDate(fechaLimit.getDate() + Number(dias));

    return this.prisma.poliza.findMany({
      where: {
        fechaVencimiento: {
          lte: fechaLimit,
          gte: new Date(),
        },
        deletedAt: null as any,
      },
      include: {
        cliente: true,
      },
      orderBy: { fechaVencimiento: 'asc' },
    });
  }

  async findEnMora() {
    return this.prisma.poliza.findMany({
      where: {
        mora: { isNot: null },
        deletedAt: null as any,
      },
      include: {
        cliente: true,
        mora: true,
      },
    });
  }

  async update(id: string, data: UpdatePolizaDto) {
    const { fechaVencimiento, fechaInicio, ...resto } = data;
    return this.prisma.poliza.update({
      where: { id },
      data: {
        ...resto,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.poliza.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}