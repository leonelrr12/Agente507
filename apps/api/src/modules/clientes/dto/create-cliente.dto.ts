import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  cedula?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}