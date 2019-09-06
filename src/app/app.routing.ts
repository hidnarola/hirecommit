import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuard } from './shared/gard/auth.guard';
import { LoginGuard } from './shared/gard/login.guard';
import { BussinessDetailComponent } from './views/bussiness-detail/bussiness-detail.component';
import { BussinessDetail1Component } from './views/bussiness-detail1/bussiness-detail1.component';
import { ChangepasswordComponent } from './views/changepassword/changepassword.component';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'employer/view',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  
  {
    path: 'businessDeatil',
    component: BussinessDetailComponent,
    data: {
      title: 'Business Detail Page'
    }
  },

  {
    path: 'businessDeatil1',
    component: BussinessDetail1Component,
    data: {
      title: 'Business Detail Page'
    }
  },

  { path: 'forgotpassword',
  component: ForgotPasswordComponent,
  data: {
    title: 'forgotpassword',
  }
},
  

  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'employer',
        loadChildren: () => import('./views/employer/employer.module').then(m => m.EmployerModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'candidate',
        loadChildren: () => import('./views/candidate/candidate.module').then(m => m.CandidateModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'employeruser',
        loadChildren: () => import('./views/employer-user/employer-user.module').then(m => m.EmployerUserModule),
        canActivate: [AuthGuard]
      },
      { path: 'changepassword',
        component: ChangepasswordComponent,
        data: {
          title: 'changepassword',
        },
        canActivate: [AuthGuard]
      },
     
    
   
      {
        path: 'candidate',
        loadChildren: () => import('./views/candidate/candidate.module').then(m => m.CandidateModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'candidateUser',
        loadChildren: () => import('./views/candidate-user/candidate-user.module').then(m => m.CandidateUserModule),
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
