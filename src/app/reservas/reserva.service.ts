import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reserva, ReservaRequest, ReservaResponse } from '../core/models/reserva.model';
import { EstadoReserva, ESTADO_RESERVA_CODIGOS } from '../core/models/enums/estado-reserva.enum';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = environment.reservasUrl;

  constructor(private http: HttpClient) {}

  listar(): Observable<ReservaResponse[]> {
    return this.http.get<ReservaResponse[]>(`${this.apiUrl}/reservas`);
  }

  obtenerPorId(id: number): Observable<ReservaResponse> {
    return this.http.get<ReservaResponse>(`${this.apiUrl}/reservas/${id}`);
  }

  registrar(request: ReservaRequest): Observable<ReservaResponse> {
    return this.http.post<ReservaResponse>(`${this.apiUrl}/reservas`, request);
  }

  actualizar(request: ReservaRequest, id: number): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/reservas/${id}`, request);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservas/${id}`);
  }

  checkIn(id: number, numHabitacion: number): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/reservas/check-in/${id}?numHabitacion=${numHabitacion}`, {});
  }

  checkOut(id: number, numHabitacion: number): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/reservas/check-out/${id}?numHabitacion=${numHabitacion}`, {});
  }

  cancelar(id: number, numHabitacion: number): Observable<ReservaResponse> {
    return this.http.put<ReservaResponse>(`${this.apiUrl}/reservas/cancelar/${id}?numHabitacion=${numHabitacion}`, {});
  }

  obtenerEstadoPorCodigo(codigo: number): EstadoReserva {
    switch (codigo) {
      case ESTADO_RESERVA_CODIGOS.CONFIRMADA:
        return EstadoReserva.CONFIRMADA;
      case ESTADO_RESERVA_CODIGOS.EN_CURSO:
        return EstadoReserva.EN_CURSO;
      case ESTADO_RESERVA_CODIGOS.FINALIZADA:
        return EstadoReserva.FINALIZADA;
      case ESTADO_RESERVA_CODIGOS.CANCELADA:
        return EstadoReserva.CANCELADA;
      default:
        throw new Error('Código de estado de reserva no válido');
    }
  }

  obtenerCodigoPorEstado(estado: EstadoReserva): number {
    switch (estado) {
      case EstadoReserva.CONFIRMADA:
        return ESTADO_RESERVA_CODIGOS.CONFIRMADA;
      case EstadoReserva.EN_CURSO:
        return ESTADO_RESERVA_CODIGOS.EN_CURSO;
      case EstadoReserva.FINALIZADA:
        return ESTADO_RESERVA_CODIGOS.FINALIZADA;
      case EstadoReserva.CANCELADA:
        return ESTADO_RESERVA_CODIGOS.CANCELADA;
      default:
        throw new Error('Estado de reserva no válido');
    }
  }

  puedeModificarFechas(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA || estado === EstadoReserva.EN_CURSO;
  }

  puedeModificarFechaEntrada(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA;
  }

  puedeModificarFechaSalida(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA || estado === EstadoReserva.EN_CURSO;
  }

  puedeModificarHabitacion(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA;
  }

  puedeCancelar(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA;
  }

  puedeRealizarCheckIn(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.CONFIRMADA;
  }

  puedeRealizarCheckOut(estado: EstadoReserva): boolean {
    return estado === EstadoReserva.EN_CURSO;
  }
}
