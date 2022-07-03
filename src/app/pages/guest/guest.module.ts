import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestRoutingModule } from './guest-routing.module';
import { GuestComponent } from './guest.component';
import { SharedModule } from 'src/app/components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConsultNowComponent } from './consult-now/consult-now.component';
import { ConsultLaterComponent } from './consult-later/consult-later.component';
import { ServiceTypeSelectionComponent } from './service-type-selection/service-type-selection.component';
import { SelectPatientComponent } from './select-patient/select-patient.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { BookConsultationComponent } from './book-consultation/book-consultation.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentRoomComponent } from './appointment-room/appointment-room.component';


@NgModule({
  declarations: [
    GuestComponent,
    ConsultNowComponent,
    ConsultLaterComponent,
    ServiceTypeSelectionComponent,
    SelectPatientComponent,
    SelectServiceComponent,
    AppointmentComponent,
    BookConsultationComponent,
    AppointmentsComponent,
    AppointmentRoomComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GuestRoutingModule
  ]
})
export class GuestModule { }
