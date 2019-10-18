import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';

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
          title: 'Approved Employer'
        },
      },
      {
        path: 'approved_employer/add',
        component: EmployerViewComponent,
        data: {
          title: 'Add Approved Employer'
        }
      },
      {
        path: 'approved_employer/view/:id',
        component: EmployerViewComponent,
        data: {
          title: 'View Approved Employer'
        }
      },
      // children: [
      //   {
      //     path: 'add',
      //     component: EmployerViewComponent,
      //     data: {
      //       title: 'Add'
      //     }
      //   },
      //   {
      //     path: 'view/:id',
      //     component: EmployerViewComponent,
      //     data: {
      //       title: 'View'
      //     }
      //   },
      // ]
      // },
      {
        path: 'new_employer',
        component: EmployerListComponent,
        data: {
          title: 'New Employer'
        },
      },
      {
        path: 'new_employer/add',
        component: EmployerViewComponent,
        data: {
          title: 'Add New Employer'
        }
      },
      {
        path: 'new_employer/view/:id',
        component: EmployerViewComponent,
        data: {
          title: 'View New Employer'
        }
      },
      // children: [
      //   {
      //     path: 'add',
      //     component: EmployerViewComponent,
      //     data: {
      //       title: 'Add'
      //     }
      //   },
      //   {
      //     path: 'view/:id',
      //     component: EmployerViewComponent,
      //     data: {
      //       title: 'View'
      //     }
      //   },
      // ]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
