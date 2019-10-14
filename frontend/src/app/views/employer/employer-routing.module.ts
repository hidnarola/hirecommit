import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { TimelineComponent } from './timeline/timeline.component';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { ProfileComponent } from '../../shared/profile/profile.component';
import {ListCustomFeildComponent} from '../employer/manage-custom-feild/list-custom-feild/list-custom-feild.component'
const routes: Routes = [
  {
    path: '',
    redirectTo: 'manage_offer',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'manage_offer',
        loadChildren: () => import('./employer-user/employer-user.module').then(m => m.EmployerUserModule)
      },
      {
        path: 'manage_subaccount',
        loadChildren: () => import('./sub-accounts/sub-accounts.module').then(m => m.SubAccountsModule)
      },
      {
        path: 'manage_group',
        loadChildren: () => import('./manage-groups/manage-groups.module').then(m => m.ManageGroupsModule)
      },
      {
        path: 'manage_salarybracket',
        loadChildren: () => import('./manag-salary-bracket/manag-salary-bracket.module').then(m => m.ManagSalaryBracketModule)
      },
      {
        path: 'manage_candidate',
        loadChildren: () => import('../admin/candidate/candidate.module').then(m => m.CandidateModule)
      },
      {
        path: 'manage_location',
        loadChildren: () => import('./manage-location/manage-location.module').then(m => m.ManageLocationModule)
      },
      {
        path: 'customfeild',
        loadChildren: () => import('./manage-custom-feild/manage-custom-feild.module').then(m => m.ManageCustomFeildModule)
      },
      { path: 'timeline', component: TimelineComponent },
      { path: 'change-password', component: ChangepasswordComponent },
      { path: 'profile', component: ProfileComponent },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
