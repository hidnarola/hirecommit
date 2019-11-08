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
    // data: {
    //   title: 'Home'
    // },
    children: [
      {
        path: 'offers',
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'sub_accounts',
        loadChildren: () => import('./sub-accounts/sub-accounts.module').then(m => m.SubAccountsModule)
      },
      {
        path: 'groups',
        loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
      },
      {
        path: 'salary_brackets',
        loadChildren: () => import('./salary-brackets/salary-brackets.module').then(m => m.SalaryBracketsModule)
      },
      {
        path: 'candidates',
        loadChildren: () => import('../shared-components/candidates/candidate.module').then(m => m.CandidateModule)
      },
      {
        path: 'locations',
        loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule)
      },
      {
        path: 'custom_fields',
        loadChildren: () => import('./custom-fields/custom-fields.module').then(m => m.CustomFieldsModule)
      },
      // { path: 'history/:id', component: TimelineComponent },
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
