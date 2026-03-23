import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { ClientesModule } from '@/modules/clientes/clientes.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PolizasModule } from '@/modules/polizas/polizas.module';
import { UsuariosModule } from './src/modules/usuarios/usuarios.module';
import { AseguradorasModule } from './src/modules/aseguradoras/aseguradoras.module';
import { DashboardModule } from './src/modules/dashboard/dashboard.module';
import { SeguimientosModule } from './src/modules/seguimientos/seguimientos.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    ClientesModule,
    PolizasModule,
    AuthModule,
    UsuariosModule,
    AseguradorasModule,
    DashboardModule,
    SeguimientosModule
  ],
})
export class AppModule { }