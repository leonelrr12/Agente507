import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'apps/api/prisma/prisma.service';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { email },
      });

      if (!user) throw new UnauthorizedException('Credenciales inválidas');

      // validar password (bcrypt)

    const isValid = await bcrypt.compare(password, user.passwordHash);
     if (!isValid) {
      throw new UnauthorizedException(
        `Password incorrecto. Recibido: ${password.length} chars. Hash en DB: ${user.passwordHash?.length} chars.`
      );
    }    

    if (!user) throw new UnauthorizedException('Credenciales inválidas - AAAAAAAAAAAAAAA');
      const payload = { sub: user.id };

      return {
        access_token: this.jwtService.sign(payload),
        debeCambiarPassword: user.debeCambiarPassword,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new BadRequestException(error.message || 'Error en el proceso de login');
    }
  }
}
