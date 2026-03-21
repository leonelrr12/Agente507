import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from '@/modules/health/health.module';
import { ClientesModule } from '@/modules/clientes/clientes.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { PolizasModule } from '@/modules/polizas/polizas.module';
import { UsuariosModule } from './src/modules/usuarios/usuarios.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    ClientesModule,
    PolizasModule,
    AuthModule,
    UsuariosModule
  ],
})
export class AppModule { }