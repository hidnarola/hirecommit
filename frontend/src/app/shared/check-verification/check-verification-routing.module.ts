import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckVerificationComponent } from './check-verification.component';


const routes: Routes = [
  {
    path: '',
    component: CheckVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckVerificationRoutingModule { }
