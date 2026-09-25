import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../reserva.service';
import { ReservaResponse } from '../../core/models/reserva.model';
import { EstadoReserva, ESTADO_RESERVA_LABELS } from '../../core/models/enums/estado-reserva.enum';
import { MatDialog } from '@angular/material/dialog';
import { ReservaFormComponent } from '../reserva-form/reserva-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HuespedService } from '../../huespedes/huesped.service';
import { HuespedResponse } from '../../core/models/huesped.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reserva-list',
  standalone: false,
  templateUrl: './reserva-list.component.html',
  styleUrls: ['./reserva-list.component.scss']
})
export class ReservaListComponent implements OnInit {
  reservas: ReservaResponse[] = [];
  huespedes: HuespedResponse[] = [];
  displayedColumns: string[] = ['id', 'huesped', 'habitacion', 'estado', 'fechaEntrada', 'fechaSalida', 'acciones'];
  estadoLabels = ESTADO_RESERVA_LABELS;

  constructor(
    public reservaService: ReservaService,
    private huespedService: HuespedService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    forkJoin({
      reservas: this.reservaService.listar(),
      huespedes: this.huespedService.listar()
    }).subscribe({
      next: ({ reservas, huespedes }) => {
        this.huespedes = huespedes;
        this.reservas = reservas;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar reservas', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  crearReserva(): void {
    const dialogRef = this.dialog.open(ReservaFormComponent, {
      width: '500px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarReservas();
        this.snackBar.open('Reserva creada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  editarReserva(reserva: ReservaResponse): void {
    const dialogRef = this.dialog.open(ReservaFormComponent, {
      width: '500px',
      data: { mode: 'edit', reserva }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarReservas();
        this.snackBar.open('Reserva actualizada exitosamente', 'Cerrar', { duration: 3000 });
      }
    });
  }

  eliminarReserva(id: number): void {
    if (confirm('¿Está seguro de eliminar esta reserva?')) {
      this.reservaService.eliminar(id).subscribe({
        next: () => {
          this.cargarReservas();
          this.snackBar.open('Reserva eliminada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error al eliminar reserva', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  checkIn(reserva: ReservaResponse): void {
    if (!this.reservaService.puedeRealizarCheckIn(reserva.estadoReserva)) {
      this.snackBar.open('Solo se puede hacer check-in en reservas confirmadas', 'Cerrar', { duration: 3000 });
      return;
    }

    this.reservaService.checkIn(reserva.id, reserva.numHabitacion).subscribe({
      next: () => {
        this.cargarReservas();
        this.snackBar.open('Check-in realizado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error al realizar check-in', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  checkOut(reserva: ReservaResponse): void {
    if (!this.reservaService.puedeRealizarCheckOut(reserva.estadoReserva)) {
      this.snackBar.open('Solo se puede hacer check-out en reservas en curso', 'Cerrar', { duration: 3000 });
      return;
    }

    this.reservaService.checkOut(reserva.id, reserva.numHabitacion).subscribe({
      next: () => {
        this.cargarReservas();
        this.snackBar.open('Check-out realizado exitosamente', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Error al realizar check-out', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  cancelarReserva(reserva: ReservaResponse): void {
    if (!this.reservaService.puedeCancelar(reserva.estadoReserva)) {
      this.snackBar.open('Solo se puede cancelar reservas confirmadas', 'Cerrar', { duration: 3000 });
      return;
    }

    if (confirm('¿Está seguro de cancelar esta reserva?')) {
      this.reservaService.cancelar(reserva.id, reserva.numHabitacion).subscribe({
        next: () => {
          this.cargarReservas();
          this.snackBar.open('Reserva cancelada exitosamente', 'Cerrar', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error al cancelar reserva', 'Cerrar', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  nombreHuesped(reserva: ReservaResponse): string {
    if (reserva.nombreHuesped) {
      return reserva.nombreHuesped;
    }
    const huesped = this.huespedes.find(item => item.id === reserva.idHuesped);
    if (!huesped) {
      return 'N/A';
    }
    return `${huesped.nombre} ${huesped.apellidoPaterno}`;
  }

  obtenerLabelEstado(estado: EstadoReserva): string {
    return this.estadoLabels[estado] || estado;
  }
}
