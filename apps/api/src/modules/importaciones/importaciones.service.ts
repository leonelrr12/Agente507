import { PrismaService } from 'apps/api/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import csv from 'csv-parser';
import * as fs from 'fs';

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

  async procesarMora(row: any) {
    const poliza = await this.prisma.poliza.findUnique({
      where: { numeroPoliza: row.numero_poliza },
    });

    if (!poliza) throw new Error('Poliza no encontrada');

    return this.prisma.mora.upsert({
      where: { polizaId: poliza.id },
      update: {
        diasAtraso: Number(row.dias_atraso),
        montoPendiente: Number(row.monto),
      },
      create: {
        polizaId: poliza.id,
        diasAtraso: Number(row.dias_atraso),
        montoPendiente: Number(row.monto),
      },
    });
  }
}