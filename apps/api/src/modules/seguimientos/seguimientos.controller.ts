import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SeguimientosService } from './seguimientos.service';
import { AuthGuard } from '../auth/auth.guards';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

@UseGuards(AuthGuard)
@Controller('seguimientos')
export class SeguimientosController {
  constructor(private service: SeguimientosService) {}

  @Post()
  create(@Body() data: CreateSeguimientoDto, @Req() req: any) {
    // Ensuring the user who is logged in is the one creating the follow-up
    return this.service.create({
      ...data,
      usuarioId: req.user.sub,
    });
  }

  @Get('poliza/:polizaId')
  findAll(@Param('polizaId') polizaId: string) {
    return this.service.findAllPorPoliza(polizaId);
  }
}
