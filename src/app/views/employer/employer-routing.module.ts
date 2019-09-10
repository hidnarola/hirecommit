import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewEmployerComponent } from './view-employer/view-employer.component';
import { AddEmployerComponent } from './add-employer/add-employer.component';
import { EmployerDetailComponent } from './employer-detail/employer-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employer'
    },
    children: [
      {
        path: '',
        redirectTo: 'view'
      },
      {
        path: 'view',
        component: ViewEmployerComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'add',
        component: AddEmployerComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'detail',
        component: EmployerDetailComponent,
        data: {
          title: 'Detail'
        }
      },
      {
        path: 'edit',
        component: AddEmployerComponent,
        data: {
          title: 'Edit'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
