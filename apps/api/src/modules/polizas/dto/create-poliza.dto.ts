import { IsEnum, IsNumber, IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';
import { TipoPoliza, EstadoPoliza } from '@prisma/client';

export class CreatePolizaDto {
  @IsString()
  numeroPoliza!: string;

  @IsEnum(TipoPoliza)
  tipo!: TipoPoliza;

  @IsOptional()
  @IsString()
  subtipo?: string;

  @IsDateString()
  fechaVencimiento!: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsEnum(EstadoPoliza)
  estado?: EstadoPoliza;

  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsString()
  frecuenciaPago?: string;

  @IsUUID()
  clienteId!: string;

  @IsOptional()
  @IsUUID()
  aseguradoraId?: string;
}
