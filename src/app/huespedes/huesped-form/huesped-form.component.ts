import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HuespedResponse, HuespedRequest, EstadoReserva, ESTADO_RESERVA_LABELS } from '../../core/models/huesped.model';
import { HuespedService } from '../huesped.service';

@Component({
  selector: 'app-huesped-form',
  standalone: false,
  templateUrl: './huesped-form.component.html',
  styleUrl: './huesped-form.component.scss'
})
export class HuespedFormComponent implements OnInit {

  guardando = false;
  esEdicion = false;
  form: FormGroup;
  readonly estadosReserva = Object.values(EstadoReserva);
  readonly estadoLabels = ESTADO_RESERVA_LABELS;

  constructor(
    private fb: FormBuilder,
    private huespedService: HuespedService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<HuespedFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HuespedResponse | null
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$')]],
      telefono: ['', [Validators.required]],
      tipoDocumento: [''],
      documento: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      estado: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.esEdicion = true;
      this.form.patchValue({
        nombre: this.data.nombre,
        apellidoPaterno: this.data.apellidoPaterno,
        apellidoMaterno: this.data.apellidoMaterno,
        email: this.data.email,
        telefono: this.data.telefono,
        tipoDocumento: this.data.tipoDocumento,
        documento: this.data.documento,
        nacionalidad: this.data.nacionalidad
      });

      this.form.get('id')?.disable();
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando = true;
    const request: HuespedRequest = this.form.getRawValue();

    const obs = this.esEdicion
      ? this.huespedService.actualizar(this.data!.id, request)
      : this.huespedService.registrar(request);

    obs.subscribe({
      next: () => {
        this.guardando = false;
        this.dialogRef.close(true);
        this.mostrarMensaje(`Huésped: ${request.nombre} ${request.apellidoPaterno} ${this.esEdicion ? 'actualizado' : 'registrado'}`);
      },
      error: (err) => {
        this.guardando = false;
        this.mostrarMensaje(err?.error?.message ?? 'Error al guardar el huésped');
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