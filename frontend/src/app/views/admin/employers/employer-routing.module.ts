import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { ReportComponent } from './report/report.component';
import { ReportHistoryComponent } from './report/report-history/report-history.component';
import { OfferAddViewComponent } from '../../shared-components/offers/offer-add-view/offer-add-view.component';
import { SubAccountsListComponent } from '../../employer/sub-accounts/sub-accounts-list/sub-accounts-list.component';
import { SubAccountAddViewComponent } from '../../employer/sub-accounts/sub-account-add-view/sub-account-add-view.component';
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
        path: 'approved_employer/:id/sub_accounts/list',
        component: SubAccountsListComponent,
        data: {
          title: 'Sub - Account List',
          // type: 'approved'
        },
      },
      {
        path: 'approved_employer/:id/sub_accounts/view/:id',
        component: SubAccountAddViewComponent,
        data: {
          title: 'Sub - Account View',
          // type: 'approved'
        },
      },
      {
        path: 'approved_employer/:id/sub_accounts/edit/:id',
        component: SubAccountAddViewComponent,
        data: {
          title: 'Sub - Account Edit',
          // type: 'approved'
        },
      },

      {
        path: 'approved_employer/report/:id/list',
        component: ReportComponent,
        data: {
          title: 'Report',
          // type: 'new'
        }
      },
      {
        path: 'approved_employer/report/:id/history/:id',
        component: ReportHistoryComponent,
        data: {
          title: 'Offer History',
          // type: 'new'
        }
      },
      {
        path: 'approved_employer/report/:report_id/view/:id',
        component: OfferAddViewComponent,
        data: {
          title: 'Offer View',
          // type: 'new'
        }
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
        path: 'approved_employer/edit/:id',
        component: EmployerViewComponent,
        data: {
          title: 'Edit Approved Employer',
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

      // {
      //   path: 'history/:id',
      //   component: TimelineComponent,
      //   data: {
      //     title: 'Offer History',
      //     // type: 'new'
      //   }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerRoutingModule { }
