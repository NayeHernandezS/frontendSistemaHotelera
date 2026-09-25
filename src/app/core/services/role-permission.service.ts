import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Rol, ROLES } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {

  constructor(private authService: AuthService) {}

  // Permisos para huéspedes
  puedeCrearHuesped(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeEditarHuesped(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeEliminarHuesped(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  // Permisos para habitaciones
  puedeConsultarHabitaciones(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeCrearHabitacion(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeEditarHabitacion(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeEliminarHabitacion(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeModificarPrecioHabitacion(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeCambiarEstadoHabitacion(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  // Permisos para reservas
  puedeCrearReserva(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeEditarReserva(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeEliminarReserva(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeRealizarCheckIn(): boolean {
    return this.authService.isAuthenticated();
  }

  puedeRealizarCheckOut(): boolean {
    return this.authService.isAuthenticated();
  }

  // Permisos para usuarios
  puedeCrearUsuario(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeEditarUsuario(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeEliminarUsuario(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  puedeConsultarReportes(): boolean {
    return this.authService.hasRole(ROLES[0]); // Solo ADMIN
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isUser(): boolean {
    return this.authService.hasRole(ROLES[1]);
  }
}
