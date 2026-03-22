import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { AseguradorasService } from './aseguradoras.service';
import { AuthGuard } from '../auth/auth.guards';

@UseGuards(AuthGuard)
@Controller('aseguradoras')
export class AseguradorasController {
  constructor(private service: AseguradorasService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() data: { nombre: string }) {
    return this.service.create(data);
  }
}
