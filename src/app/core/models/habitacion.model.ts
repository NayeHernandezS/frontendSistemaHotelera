export enum TipoHabitacion {
  INDIVIDUAL = 'INDIVIDUAL',
  DOBLE = 'DOBLE',
  FAMILIAR = 'FAMILIAR'
}

export const TIPO_HABITACION_LABELS: Record<TipoHabitacion, string> = {
  [TipoHabitacion.INDIVIDUAL]: 'Individual',
  [TipoHabitacion.DOBLE]: 'Doble',
  [TipoHabitacion.FAMILIAR]: 'Familiar'
};

export const TIPO_HABITACION_DESCRIPCIONES: Record<TipoHabitacion, string> = {
  [TipoHabitacion.INDIVIDUAL]: 'Espacio asignado para un solo huésped.',
  [TipoHabitacion.DOBLE]: 'Habitación preparada para dos personas.',
  [TipoHabitacion.FAMILIAR]: 'Cuenta con capacidad para cuatro o más personas, a veces con sofás cama o literas.'
};

export const TIPO_HABITACION_CAPACIDAD: Record<TipoHabitacion, {min: number, max: number}> = {
  [TipoHabitacion.INDIVIDUAL]: {min: 1, max: 1},
  [TipoHabitacion.DOBLE]: {min: 2, max: 2},
  [TipoHabitacion.FAMILIAR]: {min: 4, max: 10}
};

export const TIPO_HABITACION_CODIGOS: Record<TipoHabitacion, number> = {
  [TipoHabitacion.INDIVIDUAL]: 1,
  [TipoHabitacion.DOBLE]: 2,
  [TipoHabitacion.FAMILIAR]: 3
};

export const TIPO_HABITACION_POR_CODIGO: Record<number, TipoHabitacion> = {
  1: TipoHabitacion.INDIVIDUAL,
  2: TipoHabitacion.DOBLE,
  3: TipoHabitacion.FAMILIAR
};

export enum EstadoHabitacion {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADA = 'OCUPADA',
  LIMPIEZA = 'LIMPIEZA',
  MANTENIMIENTO = 'MANTENIMIENTO'
}

export const ESTADO_HABITACION_LABELS: Record<EstadoHabitacion, string> = {
  [EstadoHabitacion.DISPONIBLE]: 'Disponible',
  [EstadoHabitacion.OCUPADA]: 'Ocupada',
  [EstadoHabitacion.LIMPIEZA]: 'Limpieza',
  [EstadoHabitacion.MANTENIMIENTO]: 'Mantenimiento'
};

export const ESTADO_HABITACION_DESCRIPCIONES: Record<EstadoHabitacion, string> = {
  [EstadoHabitacion.DISPONIBLE]: 'Habitacion Disponible',
  [EstadoHabitacion.OCUPADA]: 'La habitacion se encuentra ocupada',
  [EstadoHabitacion.LIMPIEZA]: 'La habitacion se encuentra en limpieza',
  [EstadoHabitacion.MANTENIMIENTO]: 'La habitacion se encuentra en mantenimiento por el momento'
};

export const ESTADO_TRANSICIONES_PERMITIDAS: Record<EstadoHabitacion, EstadoHabitacion[]> = {
  [EstadoHabitacion.DISPONIBLE]: [EstadoHabitacion.OCUPADA, EstadoHabitacion.MANTENIMIENTO],
  [EstadoHabitacion.OCUPADA]: [EstadoHabitacion.LIMPIEZA],
  [EstadoHabitacion.LIMPIEZA]: [EstadoHabitacion.DISPONIBLE, EstadoHabitacion.MANTENIMIENTO],
  [EstadoHabitacion.MANTENIMIENTO]: [EstadoHabitacion.DISPONIBLE]
};

export const ESTADO_PROPIEDADES: Record<EstadoHabitacion, {actualizable: boolean, eliminable: boolean}> = {
  [EstadoHabitacion.DISPONIBLE]: {actualizable: true, eliminable: true},
  [EstadoHabitacion.OCUPADA]: {actualizable: true, eliminable: false},
  [EstadoHabitacion.LIMPIEZA]: {actualizable: true, eliminable: false},
  [EstadoHabitacion.MANTENIMIENTO]: {actualizable: true, eliminable: false}
};

export const ESTADO_HABITACION_CODIGOS: Record<EstadoHabitacion, number> = {
  [EstadoHabitacion.DISPONIBLE]: 1,
  [EstadoHabitacion.OCUPADA]: 2,
  [EstadoHabitacion.LIMPIEZA]: 3,
  [EstadoHabitacion.MANTENIMIENTO]: 4
};

export const ESTADO_HABITACION_POR_CODIGO: Record<number, EstadoHabitacion> = {
  1: EstadoHabitacion.DISPONIBLE,
  2: EstadoHabitacion.OCUPADA,
  3: EstadoHabitacion.LIMPIEZA,
  4: EstadoHabitacion.MANTENIMIENTO
};

export interface HabitacionRequest {
  numHabitacion: number;
  tipo: string;
  precio: number;
  capacidad: number;
}

export interface HabitacionResponse {
  numHabitacion: number;
  tipo: string;
  tipoDescripcion: string;
  precio: number;
  capacidad: number;
  estado: string;
  estadoDescripcion: string;
}