import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ViewEmployerComponent} from './view-employer/view-employer.component';
import {AddEmployerComponent} from './add-employer/add-employer.component';
import {EmployerDetailComponent} from './employer-detail/employer-detail.component';
import { RequestedEmployerComponent } from './requested-employer/requested-employer.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'view'
  }, {
    path: '',
    data: {
      title: 'Employer'
    },
    children: [
      {
        path: 'view',
        component: ViewEmployerComponent,
        data: {
          title: 'View'
        }
      }, {
        path: 'add',
        component: AddEmployerComponent,
        data: {
          title: 'Add'
        }
      }, {
        path: 'detail/:id',
        component: EmployerDetailComponent,
        data: {
          title: 'Detail'
        }
      }, {
        path: 'new_employer',
        component: RequestedEmployerComponent,
        data: {
          title: 'New Employer'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule {}
