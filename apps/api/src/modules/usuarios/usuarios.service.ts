import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'apps/api/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existing = await this.prisma.usuario.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existing) {
      throw new BadRequestException('El correo ya existe');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createUsuarioDto.password, salt);

    const newUser = await this.prisma.usuario.create({
      data: {
        nombre: createUsuarioDto.nombre,
        email: createUsuarioDto.email,
        passwordHash,
        rol: createUsuarioDto.rol || 'AGENTE',
        debeCambiarPassword: true, // Siempre true para usuarios nuevos
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        debeCambiarPassword: true,
        createdAt: true,
      },
    });

    return newUser;
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        debeCambiarPassword: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        debeCambiarPassword: true,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.usuario.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const salt = await bcrypt.genSalt();
    const newPasswordHash = await bcrypt.hash(updatePasswordDto.newPassword, salt);

    await this.prisma.usuario.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        debeCambiarPassword: false, // ¡Cambio exitoso, se quita la bandera!
      },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
