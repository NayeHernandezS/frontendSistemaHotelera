import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HabitacionRequest, HabitacionResponse, TIPO_HABITACION_CODIGOS, ESTADO_HABITACION_CODIGOS } from '../core/models/habitacion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {

  private readonly baseUrl = `${environment.habitacionesUrl}/habitaciones`;

  constructor(private http: HttpClient) { }

  listar(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.baseUrl);
  }

  obtenerPorId(id: number): Observable<HabitacionResponse> {
    return this.http.get<HabitacionResponse>(`${this.baseUrl}/${id}`);
  }

  registrar(request: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.baseUrl, request);
  }

  actualizar(numHabitacion: number, request: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.put<HabitacionResponse>(`${this.baseUrl}/${numHabitacion}`, request);
  }

  actualizarEstado(numHabitacion: number, idEstado: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${numHabitacion}/estado/${idEstado}`, null);
  }

  actualizarEstadoPorEnum(numHabitacion: number, estado: string): Observable<void> {
    const idEstado = ESTADO_HABITACION_CODIGOS[estado as keyof typeof ESTADO_HABITACION_CODIGOS];
    return this.actualizarEstado(numHabitacion, idEstado);
  }

  actualizarTipoHabitacion(numHabitacion: number, idTipo: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${numHabitacion}/tipo/${idTipo}`, null);
  }

  actualizarTipoHabitacionPorEnum(numHabitacion: number, tipo: string): Observable<void> {
    const idTipo = TIPO_HABITACION_CODIGOS[tipo as keyof typeof TIPO_HABITACION_CODIGOS];
    return this.actualizarTipoHabitacion(numHabitacion, idTipo);
  }

  eliminar(numHabitacion: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${numHabitacion}`);
  }
}