import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'employer_manage',
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
        path: 'employer_manage',
        loadChildren: () => import('./employer/employer.module').then(m => m.EmployerModule)
      },
      {
        path: 'candidate_manage',
        loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
