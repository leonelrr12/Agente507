import { PrismaService } from 'apps/api/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import csv from 'csv-parser';
import * as fs from 'fs';
import { MoraUtils } from '@/config/config.service';

type row_data = {
  diasAtraso: number,
  montoPendiente: number,
  numeroPoliza: string
}

@Injectable()
export class ImportacionesService {
  constructor(private prisma: PrismaService) {}

  async procesarArchivo(path: string, tipo: string) {
    const results: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', async () => {
          for (const row of results) {
            try {
              if (tipo === 'mora') {
                await this.procesarMora(row);
              }
            } catch (error) {
              // guardar error
            }
          }
          resolve(true);
        });
    });
  }

  async procesarMora(row: row_data) {
    const poliza = await this.prisma.poliza.findUnique({
      where: { numeroPoliza: row.numeroPoliza },
    });

    if (!poliza) throw new Error('Poliza no encontrada');

    const nivel = MoraUtils.calcularNivel(row.diasAtraso);
    
    return await this.prisma.mora.upsert({
      where: { polizaId: poliza.id },
      update: {
        diasAtraso: row.diasAtraso,
        montoPendiente: row.montoPendiente,
        nivelRiesgo: nivel, 
      },
      create: {
        polizaId: poliza.id,
        diasAtraso: row.diasAtraso,
        montoPendiente: row.montoPendiente,
        nivelRiesgo: nivel,
      },
    });
  }
}