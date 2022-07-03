import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileCredentialsComponent } from './profile-credentials/profile-credentials.component';
import { ProfileSecurityComponent } from './profile-security/profile-security.component';
import { ProfileComponent } from './profile.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProfileComponent,
        children: [
          {
            path: '',
            redirectTo: 'information',
            pathMatch: 'full'
          },
          {
            path: 'information',
            component: ProfileInfoComponent
          },
          {
            path: 'credentials',
            component: ProfileCredentialsComponent
          },
          {
            path: 'security',
            component: ProfileSecurityComponent
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
export class ProfileRoutingModule { }
