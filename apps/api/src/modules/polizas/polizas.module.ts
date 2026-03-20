import { Module } from '@nestjs/common';
import { PolizasController } from '@/modules/polizas/polizas.controller';
import { PolizasService } from './polizas.service';   // ← Asegúrate que la importación sea correcta


@Module({
    controllers: [PolizasController],
    providers: [PolizasService],        // ← ESTO ES LO QUE NORMALMENTE FALTA
})
export class PolizasModule { }