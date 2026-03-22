import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards
} from '@nestjs/common';
import { PolizasService } from './polizas.service';
import { AuthGuard } from '../auth/auth.guards';
import { CreatePolizaDto } from './dto/create-poliza.dto';
import { UpdatePolizaDto } from './dto/update-poliza.dto';

@UseGuards(AuthGuard)
@Controller('polizas')
export class PolizasController {
  constructor(private service: PolizasService) {}

  @Post()
  create(@Body() createPolizaDto: CreatePolizaDto) {
    return this.service.create(createPolizaDto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('por-vencer')
  porVencer(@Query('dias') dias: number) {
    return this.service.findPorVencer(dias || 30);
  }

  @Get('en-mora')
  enMora() {
    return this.service.findEnMora();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePolizaDto: UpdatePolizaDto) {
    return this.service.update(id, updatePolizaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}