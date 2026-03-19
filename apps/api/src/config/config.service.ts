import { NivelMora } from '@prisma/client';
import 'dotenv/config'; // 👈 IMPORTANTE

export const config = {
  port: process.env.PORT || 3000,
  url_db: process.env.DATABASE_URL,
};


export const MoraUtils = {
  calcularNivel(dias: number): NivelMora {
    if (dias <= 30) return NivelMora.LEVE;
    if (dias <= 60) return NivelMora.MEDIA;
    return NivelMora.CRITICA;
  },
};
