import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { VisitHistoryComponent } from './visit-history/visit-history.component';
import { ClinicalDocumentationComponent } from './clinical-documentation/clinical-documentation.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { PatientComponent } from './patient/patient.component';
import { SharedModule } from 'src/app/components/shared.module';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { SplitterModule } from 'primeng/splitter';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { TimelineModule } from 'primeng/timeline';
import { SkeletonModule } from 'primeng/skeleton';
import { UploadedDocumentsComponent } from './uploaded-documents/uploaded-documents.component';
import { FileUploadModule } from 'primeng/fileupload';
import { NgxPaginationModule } from 'ngx-pagination';
import { PatientVitalSignsComponent } from './patient-vital-signs/patient-vital-signs.component';
import { AnthropometricMeasurementsComponent } from './anthropometric-measurements/anthropometric-measurements.component';

@NgModule({
  declarations: [
    PatientComponent,
    PatientInfoComponent,
    VisitHistoryComponent,
    MedicalHistoryComponent,
    ClinicalDocumentationComponent,
    NewDocumentComponent,
    EditDocumentComponent,
    EditPatientComponent,
    UploadedDocumentsComponent,
    PatientVitalSignsComponent,
    AnthropometricMeasurementsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TimelineModule,
    SplitterModule,
    SkeletonModule,
    NgxPaginationModule,
    FileUploadModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    PatientRoutingModule
  ]
})
export class PatientModule { }
