import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { ReportComponent } from './report/report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'approved_employer'
  },
  {
    path: '',
    data: {
      title: 'Employers'
    },
    children: [
      {
        path: 'approved_employer',
        component: EmployerListComponent,
        data: {
          title: 'Approved Employer',
          type: 'approved'
        },
      },
      {
        path: 'approved_employer/add',
        component: EmployerViewComponent,
        data: {
          title: 'Add Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'approved_employer/view/:id',
        component: EmployerViewComponent,
        data: {
          title: 'View Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'new_employer',
        component: EmployerListComponent,
        data: {
          title: 'New Employer',
          type: 'new'
        },
      },
      {
        path: 'new_employer/add',
        component: EmployerViewComponent,
        data: {
          title: 'Add New Employer',
          type: 'new'
        }
      },
      {
        path: 'new_employer/view/:id',
        component: EmployerViewComponent,
        data: {
          title: 'View New Employer',
          type: 'new'
        }
      },
      {
        path: 'report/:id',
        component: ReportComponent,
        data: {
          title: 'Offer Report',
          // type: 'new'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
