import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestCallComponent } from './guest-call.component';

const routes: Routes = [{
  path: '',
  component: GuestCallComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestCallRoutingModule { }
