import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async resumen() {
    const today = new Date();
    const in7Days = new Date(today); in7Days.setDate(today.getDate() + 7);
    const in15Days = new Date(today); in15Days.setDate(today.getDate() + 15);
    const in30Days = new Date(today); in30Days.setDate(today.getDate() + 30);

    const [
      totalClientes,
      porVencer7,
      porVencer15,
      porVencer30,
      enMora,
      totalRecaudado,
      porTipo,
      moraPorNivel
    ] = await Promise.all([
      this.prisma.cliente.count({ where: { deletedAt: null } }),
      this.prisma.poliza.count({ 
        where: { 
          fechaVencimiento: { lte: in7Days, gte: today },
          deletedAt: null 
        } 
      }),
      this.prisma.poliza.count({ 
        where: { 
          fechaVencimiento: { lte: in15Days, gte: today },
          deletedAt: null 
        } 
      }),
      this.prisma.poliza.count({ 
        where: { 
          fechaVencimiento: { lte: in30Days, gte: today },
          deletedAt: null 
        } 
      }),
      this.prisma.mora.count(),
      this.prisma.poliza.aggregate({
        _sum: { monto: true },
        where: { deletedAt: null }
      }),
      this.prisma.poliza.groupBy({
        by: ['tipo'],
        _count: { id: true },
        where: { deletedAt: null }
      }),
      this.prisma.mora.groupBy({
        by: ['nivelRiesgo'],
        _count: { id: true }
      })
    ]);

    // Recientes
    const recientes = await this.prisma.poliza.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      where: { deletedAt: null },
      include: { cliente: true }
    });

    return {
      kpis: {
        totalClientes,
        porVencer7,
        porVencer15,
        porVencer30,
        enMora,
        volumenCartera: totalRecaudado._sum.monto || 0,
      },
      graficos: {
        distribucionRamo: porTipo.map(t => ({ tipo: t.tipo, cantidad: t._count.id })),
        riesgoMora: moraPorNivel.map(m => ({ nivel: m.nivelRiesgo, cantidad: m._count.id })),
      },
      recientes
    };
  }
}