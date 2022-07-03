import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalHistoryComponent } from './medical-history.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicalHistoryRoutingModule { }
