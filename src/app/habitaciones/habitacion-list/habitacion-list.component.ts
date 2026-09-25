import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HabitacionResponse, TipoHabitacion, EstadoHabitacion, TIPO_HABITACION_LABELS, ESTADO_HABITACION_LABELS } from '../../core/models/habitacion.model';
import { HabitacionFormComponent } from '../habitacion-form/habitacion-form.component';
import { EstadoFormComponent } from '../estado-form/estado-form.component';
import { TipoFormComponent } from '../tipo-form/tipo-form.component';
import { HabitacionService } from '../habitacion.service';

@Component({
  selector: 'app-habitacion-list',
  standalone: false,
  templateUrl: './habitacion-list.component.html',
  styleUrl: './habitacion-list.component.scss'
})
export class HabitacionListComponent implements OnInit {

  columnas = ['numHabitacion', 'tipo', 'precio', 'capacidad', 'estado', 'acciones'];
  habitaciones: HabitacionResponse[] = [];
  cargando = false;

  readonly tipoLabels = TIPO_HABITACION_LABELS;
  readonly estadoLabels = ESTADO_HABITACION_LABELS;

  constructor(
    private habitacionService: HabitacionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.buscar();
  }

  getTipoLabel(tipo: string): string {
    return this.tipoLabels[tipo as TipoHabitacion] || tipo;
  }

  getEstadoLabel(estado: string): string {
    return this.estadoLabels[estado as EstadoHabitacion] || estado;
  }

  buscar(): void {
    this.cargando = true;
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar la lista de habitaciones');
        this.cargando = false;
      }
    });
  }

  abrirFormulario(habitacion?: HabitacionResponse): void {
    const ref = this.dialog.open(HabitacionFormComponent, {
      width: '450px',
      data: habitacion ?? null
    });

    ref.afterClosed().subscribe((guardado) => {
      if (guardado) this.buscar();
    });
  }

  cambiarEstado(habitacion: HabitacionResponse): void {
    const ref = this.dialog.open(EstadoFormComponent, {
      width: '400px',
      data: habitacion
    });

    ref.afterClosed().subscribe((guardado) => {
      if (guardado) this.buscar();
    });
  }

  cambiarTipo(habitacion: HabitacionResponse): void {
    const ref = this.dialog.open(TipoFormComponent, {
      width: '450px',
      data: habitacion
    });

    ref.afterClosed().subscribe((guardado) => {
      if (guardado) this.buscar();
    });
  }

  eliminar(habitacion: HabitacionResponse): void {
    if (!confirm(`¿Eliminar la habitación "${habitacion.numHabitacion}"?`)) return;

    this.habitacionService.eliminar(habitacion.numHabitacion).subscribe({
      next: () => {
        this.mostrarMensaje('Habitación eliminada correctamente');
        this.buscar();
      },
      error: () => this.mostrarMensaje('Error al eliminar la habitación')
    });
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}