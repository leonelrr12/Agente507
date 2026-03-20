import { Module } from '@nestjs/common';
import { ClientesController } from '@/modules/clientes/clientes.controller';
import { ClientesService } from './clientes.service';   // ← Asegúrate que la importación sea correcta


@Module({
  controllers: [ ClientesController ],
  providers: [ClientesService],        // ← ESTO ES LO QUE NORMALMENTE FALTA
})
export class ClientesModule {}