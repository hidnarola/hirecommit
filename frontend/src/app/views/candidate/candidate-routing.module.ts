import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { ProfileComponent } from '../../shared/profile/profile.component';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'offers',
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
        path: 'offers',
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'change-password', component: ChangepasswordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
