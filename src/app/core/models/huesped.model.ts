import { TipoDocumento } from './enums/tipo-documento.enum';

export enum EstadoRegistro {
  ACTIVO = 'ACTIVO',
  ELIMINADO = 'ELIMINADO'
}

export const ESTADO_REGISTRO_LABELS: Record<EstadoRegistro, string> = {
  [EstadoRegistro.ACTIVO]: 'Activo',
  [EstadoRegistro.ELIMINADO]: 'Eliminado'
};

export enum EstadoReserva {
  CONFIRMADA = 'CONFIRMADA',
  EN_CURSO = 'EN_CURSO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA'
}

export const ESTADO_RESERVA_LABELS: Record<EstadoReserva, string> = {
  [EstadoReserva.CONFIRMADA]: 'Confirmada',
  [EstadoReserva.EN_CURSO]: 'En Curso',
  [EstadoReserva.FINALIZADA]: 'Finalizada',
  [EstadoReserva.CANCELADA]: 'Cancelada'
};

export interface HuespedRequest {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  nacionalidad: string;
}

export interface HuespedResponse {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  telefono: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  nacionalidad: string;
  estado: EstadoRegistro;
}