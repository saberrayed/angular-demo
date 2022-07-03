import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GuestCallRoutingModule } from './guest-call-routing.module';
import { GuestCallComponent } from './guest-call.component';
import { SharedModule } from 'src/app/components/shared.module';


@NgModule({
  declarations: [
    GuestCallComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GuestCallRoutingModule
  ]
})
export class GuestCallModule { }
