import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { ProfileComponent } from '../../shared/profile/profile.component';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { RoleGuardService } from '../../services/auth/role-guard.service'
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
          expectedRole: 'candidate',
        },
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'profile',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'candidate',
        }, component: ProfileComponent
      },
      {
        path: 'change-password',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'candidate',
        },
        component: ChangepasswordComponent
      },
      {
        path: 'account_verification',
        loadChildren: () => import('../../shared/check-verification/check-verification.module').then(m => m.CheckVerificationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
