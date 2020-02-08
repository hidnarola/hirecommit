import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { ReportComponent } from './report/report.component';
import { ReportHistoryComponent } from './report/report-history/report-history.component';
import { OfferAddViewComponent } from '../../shared-components/offers/offer-add-view/offer-add-view.component';
import { SubAccountsListComponent } from '../../employer/sub-accounts/sub-accounts-list/sub-accounts-list.component';
import { SubAccountAddViewComponent } from '../../employer/sub-accounts/sub-account-add-view/sub-account-add-view.component';
import { RoleGuardService } from '../../../services/auth/role-guard.service'
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
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'approved_employer/:id/sub_accounts/list',
        component: SubAccountsListComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Sub - Account List',
          type: 'approved'
        }

      },
      {
        path: 'approved_employer/:eid/sub_accounts/view/:id',
        component: SubAccountAddViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Sub - Account View',
        }
      },
      {
        path: 'approved_employer/:eid/sub_accounts/edit/:id',
        component: SubAccountAddViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Sub - Account Edit',
        }
      },

      {
        path: 'approved_employer/report/:id/list',
        component: ReportComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Report',
        }
      },
      {
        path: 'approved_employer/report/:id/history/:id',
        component: ReportHistoryComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Offer History',
        }
      },
      {
        path: 'approved_employer/report/:report_id/view/:id',
        component: OfferAddViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Offer View',
        }
      },

      {
        path: 'approved_employer/add',
        component: EmployerViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Add Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'approved_employer/view/:id',
        component: EmployerViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'View Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'approved_employer/edit/:id',
        component: EmployerViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Edit Approved Employer',
          type: 'approved'
        }
      },
      {
        path: 'new_employer',
        component: EmployerListComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'New Employer',
          type: 'new'
        }
      },
      {
        path: 'new_employer/add',
        component: EmployerViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
          title: 'Add New Employer',
          type: 'new'
        }
      },
      {
        path: 'new_employer/view/:id',
        component: EmployerViewComponent,
        canActivate: [RoleGuardService],
        data: {
          expectedRole: 'admin',
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
