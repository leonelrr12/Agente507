import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '../auth/auth.guards';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Post('cambiar-password')
  @UseGuards(AuthGuard)
  updatePassword(@Request() req: any, @Body() updatePasswordDto: UpdatePasswordDto) {
    // El AuthGuard inserta el payload en req.user
    // El payload tiene { sub: user.id }
    return this.usuariosService.updatePassword(req.user.sub, updatePasswordDto);
  }
}
