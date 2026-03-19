import { NivelMora } from '@prisma/client';

export const MoraUtils = {
  calcularNivel(dias: number): NivelMora {
    if (dias <= 30) return NivelMora.LEVE;
    if (dias <= 60) return NivelMora.MEDIA;
    return NivelMora.CRITICA;
  },
};
