import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitacionesRoutingModule } from './habitaciones-routing.module';
import { HabitacionFormComponent } from './habitacion-form/habitacion-form.component';
import { HabitacionListComponent } from './habitacion-list/habitacion-list.component';
import { EstadoFormComponent } from './estado-form/estado-form.component';
import { TipoFormComponent } from './tipo-form/tipo-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    HabitacionFormComponent,
    HabitacionListComponent,
    EstadoFormComponent,
    TipoFormComponent
  ],
  imports: [
    CommonModule,
    HabitacionesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class HabitacionesModule { }