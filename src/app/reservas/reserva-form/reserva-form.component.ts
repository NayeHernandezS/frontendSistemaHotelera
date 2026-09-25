import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReservaService } from '../reserva.service';
import { ReservaRequest, ReservaResponse } from '../../core/models/reserva.model';
import { EstadoReserva, ESTADO_RESERVA_CODIGOS } from '../../core/models/enums/estado-reserva.enum';
import { HuespedService } from '../../huespedes/huesped.service';
import { HabitacionService } from '../../habitaciones/habitacion.service';
import { HuespedResponse } from '../../core/models/huesped.model';
import { HabitacionResponse } from '../../core/models/habitacion.model';
import { DateAdapter } from '@angular/material/core';

interface DialogData {
  mode: 'create' | 'edit';
  reserva?: ReservaResponse;
}

@Component({
  selector: 'app-reserva-form',
  standalone: false,
  templateUrl: './reserva-form.component.html',
  styleUrls: ['./reserva-form.component.scss']
})
export class ReservaFormComponent {
  form: FormGroup;
  cargando = false;
  huespedes: HuespedResponse[] = [];
  habitaciones: HabitacionResponse[] = [];
  esEdicion = false;
  readonly EstadoReserva = EstadoReserva;
  fechaMinima: Date;
  fechaMinimaSalida: Date;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ReservaFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private reservaService: ReservaService,
    private huespedService: HuespedService,
    private habitacionService: HabitacionService,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.getFirstDayOfWeek = () => 1;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    this.fechaMinima = hoy;
    this.fechaMinimaSalida = hoy;

    this.esEdicion = data.mode === 'edit';
    this.form = this.fb.group({
      idHuesped: ['', [Validators.required]],
      numHabitacion: ['', [Validators.required]],
      estadoReserva: [{value: EstadoReserva.CONFIRMADA, disabled: true}],
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]]
    });

    if (this.esEdicion && data.reserva) {
      this.form.patchValue({
        idHuesped: data.reserva.idHuesped,
        numHabitacion: data.reserva.numHabitacion,
        estadoReserva: data.reserva.estadoReserva,
        fechaEntrada: new Date(data.reserva.fecha_Entrada),
        fechaSalida: new Date(data.reserva.fecha_Salida)
      });
      this.actualizarFechaMinimaSalida(this.form.value.fechaEntrada);
    }

    this.cargarHuespedes();
    this.cargarHabitaciones();

    this.form.get('fechaEntrada')?.valueChanges.subscribe((fecha) => {
      this.actualizarFechaMinimaSalida(fecha);
    });

    this.form.get('numHabitacion')?.valueChanges.subscribe((nuevaHabitacion) => {
      this.actualizarFechaMinimaSalida(this.form.value.fechaEntrada);
    });
  }

  cargarHuespedes(): void {
    this.huespedService.listar().subscribe({
      next: (data) => {
        this.huespedes = data;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar huéspedes', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  cargarHabitaciones(): void {
    this.habitacionService.listar().subscribe({
      next: (data) => {
        this.habitaciones = data;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar habitaciones', 'Cerrar', { duration: 3000 });
        console.error(error);
      }
    });
  }

  actualizarFechaMinimaSalida(fechaEntrada: Date | null): void {
    if (fechaEntrada) {
      const fecha = new Date(fechaEntrada);
      fecha.setDate(fecha.getDate() + 1);
      fecha.setHours(0, 0, 0, 0);
      this.fechaMinimaSalida = fecha;
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const accion = this.esEdicion ? 'actualizar' : 'crear';
    const mensaje = this.esEdicion
      ? '¿Está seguro de actualizar esta reserva?'
      : '¿Está seguro de crear esta nueva reserva?';

    if (!confirm(mensaje)) {
      return;
    }

    this.cargando = true;
    const valor = this.form.getRawValue();
    const request: ReservaRequest = {
      idHuesped: valor.idHuesped,
      numHabitacion: valor.numHabitacion,
      estadoReserva: EstadoReserva.CONFIRMADA,
      fechaEntrada: this.aLocalDateTime(valor.fechaEntrada),
      fechaSalida: this.aLocalDateTime(valor.fechaSalida)
    };

    if (this.esEdicion && this.data.reserva) {
      this.reservaService.actualizar(request, this.data.reserva.id).subscribe({
        next: () => {
          this.cargando = false;
          this.snackBar.open('Reserva actualizada exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.cargando = false;
          this.snackBar.open(this.mensajeError(error, 'Error al actualizar reserva'), 'Cerrar', { duration: 4000 });
          console.error(error);
        }
      });
    } else {
      this.reservaService.registrar(request).subscribe({
        next: () => {
          this.cargando = false;
          this.snackBar.open('Reserva creada exitosamente', 'Cerrar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.cargando = false;
          this.snackBar.open(this.mensajeError(error, 'Error al crear reserva'), 'Cerrar', { duration: 4000 });
          console.error(error);
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  private aLocalDateTime(valor: Date | string): string {
    const fecha = new Date(valor);
    const dos = (n: number) => String(n).padStart(2, '0');
    return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}T${dos(fecha.getHours())}:${dos(fecha.getMinutes())}:00`;
  }

  private mensajeError(error: { error?: { mensaje?: string } }, porDefecto: string): string {
    return error?.error?.mensaje || porDefecto;
  }

  obtenerLabelEstado(estado: EstadoReserva): string {
    const labels: Record<EstadoReserva, string> = {
      [EstadoReserva.CONFIRMADA]: 'Confirmada',
      [EstadoReserva.EN_CURSO]: 'En Curso',
      [EstadoReserva.FINALIZADA]: 'Finalizada',
      [EstadoReserva.CANCELADA]: 'Cancelada'
    };
    return labels[estado] || estado;
  }
}
