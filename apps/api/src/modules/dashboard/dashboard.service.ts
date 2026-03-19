import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/api/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async resumen() {
    const porVencer = await this.prisma.poliza.count({
      where: {
        estado: 'EN_RIESGO',
      },
    });

    const enMora = await this.prisma.mora.count();

    return {
      por_vencer: porVencer,
      en_mora: enMora,
    };
  }
}