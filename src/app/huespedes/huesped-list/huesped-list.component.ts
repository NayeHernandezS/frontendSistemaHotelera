import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HuespedResponse, EstadoRegistro, ESTADO_REGISTRO_LABELS } from '../../core/models/huesped.model';
import { HuespedFormComponent } from '../huesped-form/huesped-form.component';
import { HuespedService } from '../huesped.service';

@Component({
  selector: 'app-huesped-list',
  standalone: false,
  templateUrl: './huesped-list.component.html',
  styleUrl: './huesped-list.component.scss'
})
export class HuespedListComponent implements OnInit {

  columnas = ['id', 'nombre', 'apellidoPaterno', 'email', 'telefono', 'estado', 'acciones'];
  huespedes: HuespedResponse[] = [];
  cargando = false;

  readonly estadoLabels = ESTADO_REGISTRO_LABELS;

  constructor(
    private huespedService: HuespedService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.buscar();
  }

  getEstadoLabel(estado: string): string {
    return this.estadoLabels[estado as EstadoRegistro] || estado;
  }

  buscar(): void {
    this.cargando = true;
    this.huespedService.listar().subscribe({
      next: (data) => {
        this.huespedes = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar la lista de huéspedes');
        this.cargando = false;
      }
    });
  }

  abrirFormulario(huesped?: HuespedResponse): void {
    const ref = this.dialog.open(HuespedFormComponent, {
      width: '500px',
      data: huesped ?? null
    });

    ref.afterClosed().subscribe((guardado) => {
      if (guardado) this.buscar();
    });
  }

  eliminar(huesped: HuespedResponse): void {
    if (!confirm(`¿Eliminar al huésped "${huesped.nombre} ${huesped.apellidoPaterno}"?`)) return;

    this.huespedService.eliminar(huesped.id).subscribe({
      next: () => {
        this.mostrarMensaje('Huésped eliminado correctamente');
        this.buscar();
      },
      error: () => this.mostrarMensaje('Error al eliminar el huésped')
    });
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}