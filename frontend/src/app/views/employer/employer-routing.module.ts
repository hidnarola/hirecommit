import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { TimelineComponent } from './timeline/timeline.component';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { ProfileComponent } from '../../shared/profile/profile.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
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
        path: 'offers',
        loadChildren: () => import('./employer-user/employer-user.module').then(m => m.EmployerUserModule)
      },
      {
        path: 'sub_accounts',
        loadChildren: () => import('./sub-accounts/sub-accounts.module').then(m => m.SubAccountsModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('./manage-groups/manage-groups.module').then(m => m.ManageGroupsModule)
      },
      {
        path: 'salary_brackets',
        loadChildren: () => import('./manag-salary-bracket/manag-salary-bracket.module').then(m => m.ManagSalaryBracketModule)
      },
      {
        path: 'candidates',
        loadChildren: () => import('../admin/candidate/candidate.module').then(m => m.CandidateModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('./manage-location/manage-location.module').then(m => m.ManageLocationModule)
      },
      {
        path: 'custom_field',
        loadChildren: () => import('./manage-custom-field/manage-custom-field.module').then(m => m.ManageCustomFieldModule)
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
