import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { TimelineComponent } from './timeline/timeline.component';
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
          expectedRole: 'employer'
        },
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'sub_accounts',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('./sub-accounts/sub-accounts.module').then(m => m.SubAccountsModule)
      },
      {
        path: 'groups',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
      },
      {
        path: 'salary_brackets',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('./salary-brackets/salary-brackets.module').then(m => m.SalaryBracketsModule)
      },
      {
        path: 'candidates',
        canActivate: [RoleGuardService],

        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('../shared-components/candidates/candidate.module').then(m => m.CandidateModule)
      },
      {
        path: 'locations',
        canActivate: [RoleGuardService],

        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('./locations/locations.module').then(m => m.LocationsModule)
      },
      {
        path: 'custom_fields',
        canActivate: [RoleGuardService],

        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('./custom-fields/custom-fields.module').then(m => m.CustomFieldsModule)
      },

      // { path: 'history/:
      //   canActivate: [RoleGuardService],
      // data: {
      //   expectedRole: 'employer'
      // },id',
      // component: TimelineComponent
      // },
      {
        path: 'change-password',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer',
          name: 'change-password'
        },
        component: ChangepasswordComponent
      },
      {
        path: 'profile',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer',
          name: 'profile'
        },
        component: ProfileComponent
      },
      {
        path: 'account_verification',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'employer'
        },
        loadChildren: () => import('../../shared/check-verification/check-verification.module').then(m => m.CheckVerificationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
