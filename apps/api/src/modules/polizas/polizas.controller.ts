import {
  Controller,
  Get,
  Query
} from '@nestjs/common';
import { PolizasService } from './polizas.service';

@Controller('polizas')
export class PolizasController {
  constructor(private service: PolizasService) {}

  @Get('por-vencer')
  porVencer(@Query('dias') dias: number) {
    return this.service.findPorVencer(Number(dias));
  }

  @Get('en-mora')
  enMora(@Query('nivel') nivel: string) {
    return this.service.findEnMora(nivel);
  }
}