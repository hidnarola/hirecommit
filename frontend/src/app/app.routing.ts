import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { P404Component } from './shared/error/404.component';
import { LoginComponent } from './shared/login/login.component';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { RegisterComponent } from './shared/register/register.component';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
import { RoleGuardService } from './services/auth/role-guard.service';
import { LoginGuard } from './shared/guard/login.guard';
import { EmailconfermationComponent } from './shared/emailconfermation/emailconfermation.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './shared/terms-condition/terms-condition.component';
import { CandidateLandingComponent } from './views/static/candidate-landing/candidate-landing.component';
import { EmployerLandingComponent } from './views/static/employer-landing/employer-landing.component';
import { LandingLayoutComponent } from './views/static/landing-layout/landing-layout.component';

import { AboutUsComponent } from './shared/about-us/about-us.component';
import { ContactUSComponent } from './shared/contact-us/contact-us.component';
import { CandidateLoginComponent } from './shared/login/candidate-login/candidate-login.component';
import { EmployerLoginComponent } from './shared/login/employer-login/employer-login.component';
import { AdminLoginComponent } from './shared/login/admin-login/admin-login.component';
import { AuthorizationComponent } from './shared/login/authorization/authorization.component';
export const routes: Routes = [
  // { path: '', loadChildren: () => import('./views/static/landing-layout/landing-layout.module').then(m => m.LandingLayoutModule), },
  { path: '', component: LandingLayoutComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: 'termsandcondition', component: TermsConditionComponent },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'contactus', component: ContactUSComponent },
  { path: 'authorize', component: AuthorizationComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forgot_password', component: ForgotPasswordComponent },
  { path: 'emp_register', component: SignUpComponent },
  { path: 'candidate_register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'confirmation/:token', component: EmailconfermationComponent, canActivate: [LoginGuard] },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  { path: 'candidate_login', component: CandidateLoginComponent },
  { path: 'employer_login', component: EmployerLoginComponent },
  { path: 'admin_login', component: AdminLoginComponent },
  // { path: '', loadChildren: () => import('./views/static/landing-layout/landing-layout.module').then(m => m.LandingLayoutModule), },
  // {
  //   path: 'candidate-landing',
  //   component: CandidateLandingComponent
  // },
  // {
  //   path: 'employer-landing',
  //   component: EmployerLandingComponent
  // },
  {
    path: 'admin',
    loadChildren: () => import('./views/admin/admin.module').then(m => m.AdminModule),
    // canActivate: [RoleGuardService],
    // data: {
    //   expectedRole: 'admin'
    // }
  },
  {
    path: 'employer',
    loadChildren: () => import('./views/employer/employer.module').then(m => m.EmployerModule),

  },
  {
    path: 'candidate',
    loadChildren: () => import('./views/candidate/candidate.module').then(m => m.CandidateModule),
    // canActivate: [RoleGuardService],
    // data: {
    //   expectedRole: 'candidate'
    // }
  },
  {
    path: 'sub_employer',
    loadChildren: () => import('./views/sub-employer/sub-employer.module').then(m => m.SubEmployerModule),
    // canActivate: [RoleGuardService],
    // data: {
    //   expectedRole: 'sub-employer',
    // }
  },
  { path: '**', component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
