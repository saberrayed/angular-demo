import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentRoomComponent } from './appointment-room/appointment-room.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { BookConsultationComponent } from './book-consultation/book-consultation.component';
import { ConsultLaterComponent } from './consult-later/consult-later.component';
import { ConsultNowComponent } from './consult-now/consult-now.component';
import { GuestComponent } from './guest.component';
import { SelectPatientComponent } from './select-patient/select-patient.component';
import { SelectServiceComponent } from './select-service/select-service.component';
import { ServiceTypeSelectionComponent } from './service-type-selection/service-type-selection.component';

const routes: Routes = [
  {
    path: '',
    component: SelectPatientComponent
  },
  {
    path: ':patient_id',
    children: [
      {
        path: '',
        component: ServiceTypeSelectionComponent
      },
      {
        path: 'item/:code',
        children: [
          {
            path: '',
            component: SelectServiceComponent,
          },
          {
            path: 'book/:service_id',
            component: BookConsultationComponent
          }
        ]
      },
      {
        path: 'waiting-room/:appointment_id',
        component: AppointmentRoomComponent
      },
      {
        path: 'appointment/:appointment_id',
        component: AppointmentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
