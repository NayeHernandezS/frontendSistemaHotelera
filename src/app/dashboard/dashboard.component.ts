import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { HabitacionService } from '../habitaciones/habitacion.service';
import { HuespedService } from '../huespedes/huesped.service';
import { ReservaService } from '../reservas/reserva.service';
import { AuthService } from '../core/services/auth.service';
import { ROLES } from '../core/models/usuario.model';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  totalUsuarios = 0;
  totalHabitaciones = 0;
  totalHuespedes = 0;
  totalReservas = 0;
  reservasConfirmadas = 0;
  reservasEnCurso = 0;
  reservasFinalizadas = 0;
  reservasCanceladas = 0;
  cargando = true;
  isAdmin = false;

  constructor(
    private usuarioService: UsuarioService,
    private habitacionService: HabitacionService,
    private huespedService: HuespedService,
    private reservaService: ReservaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.hasRole(ROLES[0]);
    this.listarHabitaciones();
    this.listarHuespedes();
    this.listarReservas();
    if(this.isAdmin) {
      this.listarUsuarios();
    }
  }

  listarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.totalUsuarios = data.length;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  listarHabitaciones(): void {
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.totalHabitaciones = data.length;
      },
      error: () => {
        // Manejo de error
      }
    });
  }

  listarHuespedes(): void {
    this.huespedService.listar().subscribe({
      next: (data) => {
        this.totalHuespedes = data.length;
      },
      error: () => {
        // Manejo de error
      }
    });
  }

  listarReservas(): void {
    this.reservaService.listar().subscribe({
      next: (data) => {
        this.totalReservas = data.length;
        this.reservasConfirmadas = data.filter(r => r.estadoReserva === 'CONFIRMADA').length;
        this.reservasEnCurso = data.filter(r => r.estadoReserva === 'EN_CURSO').length;
        this.reservasFinalizadas = data.filter(r => r.estadoReserva === 'FINALIZADA').length;
        this.reservasCanceladas = data.filter(r => r.estadoReserva === 'CANCELADA').length;
      },
      error: () => {
        // Manejo de error
      }
    });
  }
}