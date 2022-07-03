import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SharedModule } from 'src/app/components/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileCredentialsComponent } from './profile-credentials/profile-credentials.component';
import { ProfileSecurityComponent } from './profile-security/profile-security.component';
import { ProfileChangeMobileComponent } from './profile-change-mobile/profile-change-mobile.component';
import { ProfileResetPasswordComponent } from './profile-reset-password/profile-reset-password.component';
import { PasswordModule } from 'primeng/password';


@NgModule({
  declarations: [
    ProfileInfoComponent,
    ProfileComponent,
    ProfileCredentialsComponent,
    ProfileSecurityComponent,
    ProfileChangeMobileComponent,
    ProfileResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    DropdownModule,
    MultiSelectModule,
    SharedModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
