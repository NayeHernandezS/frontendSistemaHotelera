import { EstadoReserva } from './enums/estado-reserva.enum';

export interface Reserva {
  id?: number;
  estadoReserva: EstadoReserva;
  fechaEntrada: Date;
  fechaSalida: Date;
  numHabitacion: number;
  idHuesped?: number;
}

export interface ReservaRequest {
  idHuesped: number;
  numHabitacion: number;
  estadoReserva: EstadoReserva;
  fechaEntrada: string;
  fechaSalida: string;
}

export interface ReservaResponse {
  id: number;
  estadoReserva: EstadoReserva;
  fecha_Entrada: Date;
  fecha_Salida: Date;
  numHabitacion: number;
  idHuesped?: number;
  nombreHuesped?: string;
}
