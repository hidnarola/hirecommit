import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerSummaryComponent } from './employer-summary/employer-summary.component';
import { EmployerAddofferComponent } from './employer-addoffer/employer-addoffer.component';
import { EmployerSummaryDetailComponent } from './employer-summary-detail/employer-summary-detail.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'EmployerUser'
    },
    children: [
      {
        path: '',
        redirectTo: 'summary'
      },
      {
        path: 'summary',
        component: EmployerSummaryComponent,
        data: {
          title: 'Summary'
        }
      },
      {
        path: 'addoffer',
        component: EmployerAddofferComponent,
        data: {
          title: 'AddOffer'
        }
      }
      ,{
        path: 'summarydetail',
        component: EmployerSummaryDetailComponent,
        data: {
          title: 'SummaryDetail'
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
