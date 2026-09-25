import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HabitacionResponse, TipoHabitacion, TIPO_HABITACION_LABELS, TIPO_HABITACION_CODIGOS } from '../../core/models/habitacion.model';
import { HabitacionService } from '../habitacion.service';

@Component({
  selector: 'app-tipo-form',
  standalone: false,
  templateUrl: './tipo-form.component.html',
  styleUrl: './tipo-form.component.scss'
})
export class TipoFormComponent implements OnInit {

  guardando = false;
  form: FormGroup;
  readonly tiposHabitacion = Object.values(TipoHabitacion);
  readonly tipoLabels = TIPO_HABITACION_LABELS;
  readonly tipoCodigos = TIPO_HABITACION_CODIGOS;

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TipoFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HabitacionResponse
  ) {
    this.form = this.fb.group({
      tipo: ['', [Validators.required]]
    });
  }

  getTipoLabel(tipo: string): string {
    return this.tipoLabels[tipo as TipoHabitacion] || tipo;
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue({
        tipo: this.data.tipo
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Validar que la capacidad actual sea válida para el nuevo tipo
    const nuevoTipo = this.form.get('tipo')?.value;
    const capacidadActual = this.data.capacidad;

    const tipoEnum = nuevoTipo as TipoHabitacion;
    const tipoCodigo = this.tipoCodigos[tipoEnum];

    this.guardando = true;

    this.habitacionService.actualizarTipoHabitacion(this.data.numHabitacion, tipoCodigo).subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
        this.mostrarMensaje(`Tipo de habitación ${this.data.numHabitacion} actualizado a ${this.tipoLabels[tipoEnum]}`);
      },
      error: (err) => {
        this.guardando = false;
        this.mostrarMensaje(err?.error?.message ?? 'Error al actualizar el tipo de habitación');
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
