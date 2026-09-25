import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HabitacionResponse, EstadoHabitacion, ESTADO_HABITACION_LABELS, ESTADO_TRANSICIONES_PERMITIDAS, ESTADO_HABITACION_CODIGOS } from '../../core/models/habitacion.model';
import { HabitacionService } from '../habitacion.service';

@Component({
  selector: 'app-estado-form',
  standalone: false,
  templateUrl: './estado-form.component.html',
  styleUrl: './estado-form.component.scss'
})
export class EstadoFormComponent implements OnInit {

  guardando = false;
  form: FormGroup;
  readonly estadosHabitacion = Object.values(EstadoHabitacion);
  readonly estadoLabels = ESTADO_HABITACION_LABELS;
  readonly transicionesPermitidas = ESTADO_TRANSICIONES_PERMITIDAS;
  readonly estadoCodigos = ESTADO_HABITACION_CODIGOS;

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EstadoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HabitacionResponse
  ) {
    this.form = this.fb.group({
      estado: ['', [Validators.required]]
    });
  }

  getEstadoLabel(estado: string | undefined): string {
    if (!estado) return 'Desconocido';
    return this.estadoLabels[estado as EstadoHabitacion] || estado;
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        estado: this.data.estado
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Validar reglas de negocio de estados usando el enum
    const estadoActual = this.data.estado;
    const nuevoEstado = this.form.get('estado')?.value;

    const transicionesPermitidas = this.transicionesPermitidas[estadoActual as EstadoHabitacion] || [];
    if (!transicionesPermitidas.includes(nuevoEstado as EstadoHabitacion)) {
      this.mostrarMensaje(`No se puede cambiar de ${this.estadoLabels[estadoActual as EstadoHabitacion]} a ${this.estadoLabels[nuevoEstado as EstadoHabitacion]}. Transición no permitida.`);
      return;
    }

    this.guardando = true;
    const nuevoEstadoCodigo = this.estadoCodigos[nuevoEstado as EstadoHabitacion];

    this.habitacionService.actualizarEstado(this.data.numHabitacion, nuevoEstadoCodigo).subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
        this.mostrarMensaje(`Estado de habitación ${this.data.numHabitacion} actualizado a ${this.estadoLabels[nuevoEstado as EstadoHabitacion]}`);
      },
      error: (err) => {
        this.guardando = false;
        this.mostrarMensaje(err?.error?.message ?? 'Error al actualizar el estado');
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }
}