import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientListComponent } from './patient-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { SkeletonModule } from 'primeng/skeleton';
import { SharedModule } from 'src/app/components/shared.module';


@NgModule({
  declarations: [
    PatientListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    SkeletonModule,
    PatientsRoutingModule
  ]
})
export class PatientsModule { }
