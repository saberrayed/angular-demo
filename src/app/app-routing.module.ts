import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './utils/guards/auth.guard';
import { NonAuthGuard } from './utils/guards/non-auth.guard';
import { NewUserGuard } from './utils/guards/new-user.guard';
import { GuestComponent } from './pages/guest/guest.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { OnboaringGuard } from './utils/guards/onboarding.guard';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/home/home.module').then( m => m.HomeModule)
      },
      {
        path: 'consults',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/patient-worklist/patient-worklist.module').then( m => m.PatientWorklistModule)
      },
      { 
        path: 'profile',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/profile/profile.module').then( m => m.ProfileModule)
      },
      {
        path: 'patients',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/patients/patients.module').then( m => m.PatientsModule)
      },
      {
        path: 'patient',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/patient/patient.module').then( m => m.PatientModule)
      },
      {
        path: 'register',
        canActivate: [NewUserGuard],
        loadChildren: () => import('./views/patient-registration/patient-registration.module').then( m => m.PatientRegistrationModule)
      },
      {
        path: 'onboarding',
        canActivate: [OnboaringGuard],
        loadChildren: () => import('./views/onboarding/onboarding.module').then( m => m.OnboardingModule)
      },
    ]
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpModule)
  },
  {
    path: 'verify-email/:id',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailModule)
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NonAuthGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordModule)
  },
  {
    path: 'reset-password/:id',
    loadChildren: () => import('./pages/reset-password/reset-password.module').then( m => m.ResetPasswordModule)
  },
  {
    path: 'guest-call',
    loadChildren: () => import('./pages/guest-call/guest-call.module').then( m => m.GuestCallModule)
  },
  {
    path: 'logout',
    component: LogoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'guest',
    loadChildren: () => import('./pages/guest/guest.module').then( m => m.GuestModule)
  },
  // {
  //   path: '', redirectTo: 'login'
  // },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
