import { IsEnum, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { TipoSeguimiento, ResultadoSeguimiento } from '@prisma/client';

export class CreateSeguimientoDto {
  @IsUUID()
  polizaId!: string;

  @IsEnum(TipoSeguimiento)
  tipo!: TipoSeguimiento;

  @IsEnum(ResultadoSeguimiento)
  resultado!: ResultadoSeguimiento;

  @IsString()
  observacion!: string;

  @IsOptional()
  @IsDateString()
  proximaLamada?: string;

  @IsUUID()
  usuarioId!: string;
}
