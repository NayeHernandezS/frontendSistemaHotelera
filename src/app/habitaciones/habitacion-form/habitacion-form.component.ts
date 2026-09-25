import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HabitacionResponse, HabitacionRequest, TipoHabitacion, TIPO_HABITACION_LABELS, TIPO_HABITACION_CAPACIDAD } from '../../core/models/habitacion.model';
import { HabitacionService } from '../habitacion.service';

@Component({
  selector: 'app-habitacion-form',
  standalone: false,
  templateUrl: './habitacion-form.component.html',
  styleUrl: './habitacion-form.component.scss'
})
export class HabitacionFormComponent implements OnInit {

  guardando = false;
  esEdicion = false;
  form: FormGroup;
  readonly tiposHabitacion = Object.values(TipoHabitacion);
  readonly tipoLabels = TIPO_HABITACION_LABELS;
  readonly tipoCapacidad = TIPO_HABITACION_CAPACIDAD;

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<HabitacionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HabitacionResponse | null
  ) {
    this.form = this.fb.group({
      numHabitacion: ['', [Validators.required, Validators.min(1)]],
      tipo: ['', [Validators.required]],
      precio: ['', [Validators.required, Validators.min(0.01), Validators.max(100000)]],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.esEdicion = true;
      this.form.patchValue({
        numHabitacion: this.data.numHabitacion,
        tipo: this.data.tipo,
        precio: this.data.precio,
        capacidad: this.data.capacidad
      });

      this.form.get('numHabitacion')?.disable();
      // Actualizar validación de capacidad para el tipo existente
      this.actualizarValidacionCapacidad(this.data.tipo);
    } else {
      // Actualizar validación de capacidad para el tipo por defecto
      const tipoInicial = this.form.get('tipo')?.value;
      if (tipoInicial) {
        this.actualizarValidacionCapacidad(tipoInicial);
      }
    }

    // Agregar listener para actualizar validación de capacidad cuando cambia el tipo
    this.form.get('tipo')?.valueChanges.subscribe(tipo => {
      this.actualizarValidacionCapacidad(tipo);
    });
  }

  private actualizarValidacionCapacidad(tipo: string): void {
    const capacidadControl = this.form.get('capacidad');
    if (!capacidadControl) return;

    const tipoEnum = tipo as TipoHabitacion;
    const rango = this.tipoCapacidad[tipoEnum];

    capacidadControl.clearValidators();
    capacidadControl.addValidators([
      Validators.required,
      Validators.min(rango.min),
      Validators.max(rango.max)
    ]);
    capacidadControl.updateValueAndValidity();
  }

  obtenerMensajeCapacidadMax(): string {
    const tipo = this.form.get('tipo')?.value;
    if (!tipo) return 'La capacidad máxima es 10 huéspedes';

    const tipoEnum = tipo as TipoHabitacion;
    const rango = this.tipoCapacidad[tipoEnum];
    return `La capacidad máxima es ${rango.max} huésped${rango.max > 1 ? 'es' : ''}`;
  }

  obtenerMensajeCapacidadMin(): string {
    const tipo = this.form.get('tipo')?.value;
    if (!tipo) return 'La capacidad mínima es 1 huésped';

    const tipoEnum = tipo as TipoHabitacion;
    const rango = this.tipoCapacidad[tipoEnum];
    return `La capacidad mínima es ${rango.min} huésped${rango.min > 1 ? 'es' : ''}`;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const request: HabitacionRequest = this.form.getRawValue();

    const obs = this.esEdicion
      ? this.habitacionService.actualizar(this.data!.numHabitacion, request)
      : this.habitacionService.registrar(request);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
        this.mostrarMensaje(`Habitación: ${request.numHabitacion} ${this.esEdicion ? 'actualizada' : 'registrada'}`);
      },
      error: (err) => {
        this.guardando = false;
        this.mostrarMensaje(err?.error?.message ?? 'Error al guardar la habitación');
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