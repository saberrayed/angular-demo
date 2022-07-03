import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicalHistoryRoutingModule } from './medical-history-routing.module';
import { MedicalHistoryComponent } from './medical-history.component';
import { SharedModule } from 'src/app/components/shared.module';


@NgModule({
  declarations: [
    MedicalHistoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MedicalHistoryRoutingModule
  ]
})
export class MedicalHistoryModule { }
