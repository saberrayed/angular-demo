import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientWorklistComponent } from './patient-worklist.component';

const routes: Routes = [
  {
    path: '',
    component: PatientWorklistComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientWorklistRoutingModule { }
