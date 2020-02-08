import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { ProfileComponent } from '../../shared/profile/profile.component';
import { RoleGuardService } from '../../services/auth/role-guard.service';

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
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'sub_accounts',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        loadChildren: () => import('../employer/sub-accounts/sub-accounts.module').then(m => m.SubAccountsModule)
      },
      {
        path: 'groups',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        loadChildren: () => import('../employer/groups/groups.module').then(m => m.GroupsModule)
      },
      // {
      //   path: 'salary_brackets',
      //   loadChildren: () => import('../employer/salary-brackets/salary-brackets.module').then(m => m.SalaryBracketsModule)
      // },

      {
        path: 'locations',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        loadChildren: () => import('../employer/locations/locations.module').then(m => m.LocationsModule)
      },
      {
        path: 'custom_fields',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        loadChildren: () => import('../employer/custom-fields/custom-fields.module').then(m => m.CustomFieldsModule)
      },
      // { path: 'timeline', component: TimelineComponent },
      {
        path: 'change-password',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'sub-employer',
        },
        component: ChangepasswordComponent
      },
      { path: 'profile', component: ProfileComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubEmployerRoutingModule { }
