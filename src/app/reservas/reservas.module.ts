import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservasRoutingModule } from './reservas-routing.module';
import { ReservaListComponent } from './reserva-list/reserva-list.component';
import { ReservaFormComponent } from './reserva-form/reserva-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    ReservaListComponent,
    ReservaFormComponent
  ],
  imports: [
    CommonModule,
    ReservasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class ReservasModule {}
