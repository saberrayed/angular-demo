import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnthropometricMeasurementsComponent } from './anthropometric-measurements/anthropometric-measurements.component';
import { ClinicalDocumentationComponent } from './clinical-documentation/clinical-documentation.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { EditPatientComponent } from './edit-patient/edit-patient.component';
import { MedicalHistoryComponent } from './medical-history/medical-history.component';
import { NewDocumentComponent } from './new-document/new-document.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { PatientVitalSignsComponent } from './patient-vital-signs/patient-vital-signs.component';
import { PatientComponent } from './patient/patient.component';
import { UploadedDocumentsComponent } from './uploaded-documents/uploaded-documents.component';
import { VisitHistoryComponent } from './visit-history/visit-history.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/patients'
  },
  {
    path: ':patient_id',
    children: [
      {
        path: '',
        component: PatientComponent,
        children: [
          {
            path: '',
            redirectTo: 'profile',
            pathMatch: 'full'
          },
          {
            path: 'profile',
            component: PatientInfoComponent
          },
          {
            path: 'edit',
            component: EditPatientComponent
          },
          {
            path: 'visit-history',
            component: VisitHistoryComponent
          },
          {
            path: 'medical-history',
            component: MedicalHistoryComponent
          },
          {
            path: 'uploaded-documents',
            component: UploadedDocumentsComponent
          },
          {
            path: 'uploaded-documents',
            component: UploadedDocumentsComponent
          },
          {
            path: 'vital-signs',
            component: PatientVitalSignsComponent
          },
          {
            path: 'anthropometric-measurements',
            component: AnthropometricMeasurementsComponent
          },
          {
            path: 'clinical-documentation',
            component: ClinicalDocumentationComponent
          },
          {
            path: 'visit/:visit_id/document/:code',
            component: NewDocumentComponent
          },
          {
            path: 'visit/:visit_id/document/:code/:document_id',
            component: EditDocumentComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
