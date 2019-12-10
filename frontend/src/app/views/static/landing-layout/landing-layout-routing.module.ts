import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateLandingComponent } from '../candidate-landing/candidate-landing.component';
import { EmployerLandingComponent } from '../employer-landing/employer-landing.component';
import { LandingLayoutComponent } from './landing-layout.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: LandingLayoutComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'candidate-landing',
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: 'candidate-landing',
  //       component: CandidateLandingComponent
  //     },
  //     {
  //       path: 'employer-landing',
  //       component: EmployerLandingComponent
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingLayoutRoutingModule { }
