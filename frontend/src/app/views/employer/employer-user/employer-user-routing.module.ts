import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerSummaryComponent } from './employer-summary/employer-summary.component';
import { EmployerAddofferComponent } from './employer-addoffer/employer-addoffer.component';
import { EmployerSummaryDetailComponent } from './employer-summary-detail/employer-summary-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Employer'
    },
    children: [
      {
        path: '',
        redirectTo: 'created_offerlist'
      },
      {
        path: 'created_offerlist',
        component: EmployerSummaryComponent,
        data: {
          title: 'Created_Offerlist'
        }
      },
      {
        path: 'addoffer',
        component: EmployerAddofferComponent,
        data: {
          title: 'AddOffer'
        }
      }
      , {
        path: 'offerdetail/:id',
        component: EmployerSummaryDetailComponent,
        data: {
          title: 'offerDetail'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerUserRoutingModule { }
