import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/components/shared.module';
import { SplitterModule } from 'primeng/splitter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingProfileInfoComponent } from './onboarding-profile-info/onboarding-profile-info.component';
import { OnboardingCredentialsComponent } from './onboarding-credentials/onboarding-credentials.component';
import { OnboardingServiceAgreementComponent } from './onboarding-service-agreement/onboarding-service-agreement.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { OnboardingClinicSetupComponent } from './onboarding-clinic-setup/onboarding-clinic-setup.component';
import { OnboardingSuccessfulComponent } from './onboarding-successful/onboarding-successful.component';

@NgModule({
  declarations: [
    OnboardingProfileInfoComponent,
    OnboardingCredentialsComponent,
    OnboardingServiceAgreementComponent,
    OnboardingClinicSetupComponent,
    OnboardingSuccessfulComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SplitterModule,
    FormsModule,
    ReactiveFormsModule,
    OnboardingRoutingModule,
    MultiSelectModule,
    DropdownModule,
  ]
})
export class OnboardingModule { }
