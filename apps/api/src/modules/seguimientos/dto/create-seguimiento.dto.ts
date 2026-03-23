import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { TipoSeguimiento } from '@prisma/client';

export class CreateSeguimientoDto {
  @IsUUID()
  polizaId!: string;

  @IsEnum(TipoSeguimiento)
  tipo!: TipoSeguimiento;

  @IsOptional()
  @IsString()
  resultado?: string;

  @IsString()
  comentario!: string;

  @IsOptional()
  @IsDateString()
  proximaAccion?: string;

  @IsUUID()
  usuarioId!: string;
}
