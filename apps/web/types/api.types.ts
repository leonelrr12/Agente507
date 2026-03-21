// --- Auth ---
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

// --- Clientes ---
export interface Cliente {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  direccion: string;
  createdAt: string;
}

// --- Pólizas ---
export type TipoPoliza = 'AUTO' | 'SALUD' | 'VIDA';
export type EstadoPoliza = 'ACTIVA' | 'EN_RIESGO' | 'VENCIDA' | 'CANCELADA';

export interface Poliza {
  id: string;
  numeroPoliza: string;
  tipo: TipoPoliza;
  subtipo?: string;
  aseguradora: string;
  fechaInicio: string;
  fechaVencimiento: string;
  estado: EstadoPoliza;
  monto: number;
  frecuenciaPago: string;
  clienteId: string;
  cliente?: Cliente;
}

// --- Seguimientos ---
export type AccionSeguimiento =
  | 'LLAMADA'
  | 'CONTACTADO'
  | 'PROMESA_PAGO'
  | 'RENOVACION'
  | 'CERRADO';

export interface Seguimiento {
  id: string;
  polizaId: string;
  comentario: string;
  accion: AccionSeguimiento;
  proximaAccion?: string;
  fecha: string;
  usuarioId: string;
}

// --- Dashboard ---
export interface DashboardStats {
  porVencer7: number;
  porVencer15: number;
  porVencer30: number;
  enMora: number;
  salvadas: number;
  canceladas: number;
}

export interface ActividadReciente {
  id: string;
  tipo: string;
  descripcion: string;
  fecha: string;
}
