import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { P404Component } from './shared/error/404.component';
import { LoginComponent } from './shared/login/login.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { RegisterComponent } from './shared/register/register.component';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
// import { AuthGuardService } from './services/auth/auth-guard.service';
import { RoleGuardService } from './services/auth/role-guard.service';
import { LoginGuard } from './shared/guard/login.guard';
import { EmailconfermationComponent } from './shared/emailconfermation/emailconfermation.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {path: 'forgot_password', component: ForgotPasswordComponent },
  {path: 'emp_register', component: SignUpComponent },
  {path: 'candidate_register', component: RegisterComponent },
  {path: 'confirmation/:id', component: EmailconfermationComponent },
  {path: 'reset-password/:token', component: ResetPasswordComponent },
  {
    path: 'admin',
    loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule),
    // canActivate: [AuthGuard],
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'admin'
    }
  },
  {
    path: 'employer',
    loadChildren: () => import('./views/employer/employer.module').then(m => m.EmployerModule),
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'employer'
    }
  },
  {
    path: 'candidate',
    loadChildren: () => import('./views/candidate/candidate.module').then(m => m.CandidateModule),
    canActivate: [RoleGuardService],
    data: {
      expectedRole: 'candidate'
    }
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}
