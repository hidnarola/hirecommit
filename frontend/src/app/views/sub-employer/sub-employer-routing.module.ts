import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultLayoutComponent } from '../../shared/containers';
import { ChangepasswordComponent } from '../../shared/changepassword/changepassword.component';
import { ProfileComponent } from '../../shared/profile/profile.component';


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
        loadChildren: () => import('../shared-components/offers/offers.module').then(m => m.OffersModule)
      },

      {
        path: 'groups',
        loadChildren: () => import('../employer/groups/groups.module').then(m => m.GroupsModule)
      },
      // {
      //   path: 'salary_brackets',
      //   loadChildren: () => import('../employer/salary-brackets/salary-brackets.module').then(m => m.SalaryBracketsModule)
      // },

      {
        path: 'locations',
        loadChildren: () => import('../employer/locations/locations.module').then(m => m.LocationsModule)
      },
      {
        path: 'custom_fields',
        loadChildren: () => import('../employer/custom-fields/custom-fields.module').then(m => m.CustomFieldsModule)
      },
      // { path: 'timeline', component: TimelineComponent },
      { path: 'change-password', component: ChangepasswordComponent },
      { path: 'profile', component: ProfileComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubEmployerRoutingModule { }
