import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingClinicSetupComponent } from './onboarding-clinic-setup/onboarding-clinic-setup.component';
import { OnboardingCredentialsComponent } from './onboarding-credentials/onboarding-credentials.component';
import { OnboardingProfileInfoComponent } from './onboarding-profile-info/onboarding-profile-info.component';
import { OnboardingServiceAgreementComponent } from './onboarding-service-agreement/onboarding-service-agreement.component';
import { OnboardingSuccessfulComponent } from './onboarding-successful/onboarding-successful.component';

const routes: Routes = [
  {
    path: 'profile-info',
    component: OnboardingProfileInfoComponent
  },
  {
    path: 'credentials',
    component: OnboardingCredentialsComponent
  },
  {
    path: 'service-agreement',
    component: OnboardingServiceAgreementComponent
  },
  {
    path: 'clinic-setup',
    component: OnboardingClinicSetupComponent
  },
  {
    path: 'successful',
    component: OnboardingSuccessfulComponent
  },
  {
    path: '',
    redirectTo: 'profile-info'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
