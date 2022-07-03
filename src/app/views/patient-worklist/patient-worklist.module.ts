import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientWorklistRoutingModule } from './patient-worklist-routing.module';
import { PatientWorklistComponent } from './patient-worklist.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  declarations: [
    PatientWorklistComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    SharedModule,
    SkeletonModule,
    PatientWorklistRoutingModule
  ]
})
export class PatientWorklistModule { }
