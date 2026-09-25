import { EstadoReserva } from './enums/estado-reserva.enum';

export enum EstadoRegistro {
  ACTIVO = 'ACTIVO',
  ELIMINADO = 'ELIMINADO'
}

export interface Reserva {
  id?: number;
  estadoReserva: EstadoReserva;
  fechaEntrada: Date;
  fechaSalida: Date;
  numHabitacion: number;
}

export interface ReservaRequest {
  idHuesped: number;
  numHabitacion: number;
  estadoReserva: string;
  fechaEntrada: string;
  fechaSalida: string;
}

export interface ReservaResponse {
  id: number;
  estadoReserva: string;
  fecha_Entrada: Date;
  fecha_Salida: Date;
  numHabitacion: number;
  idHuesped: number;
  estadoRegistro: string;
}
