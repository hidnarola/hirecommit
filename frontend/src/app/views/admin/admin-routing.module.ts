import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { RoleGuardService } from '../../services/auth/role-guard.service';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'employers',
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
        path: 'employers',
        loadChildren: () => import('./employers/employer.module').then(m => m.EmployerModule)
      },
      {
        path: 'candidates',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin'
        },
        loadChildren: () => import('../shared-components/candidates/candidate.module').then(m => m.CandidateModule)
      },
      {
        path: 'change-password',
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin'
        }, component: ChangepasswordComponent
      },
      // { path: 'profile', component: ProfileComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
