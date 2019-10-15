import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployerSummaryComponent } from './employer-summary/employer-summary.component';
import { EmployerAddofferComponent } from './employer-addoffer/employer-addoffer.component';
import { EmployerSummaryDetailComponent } from './employer-summary-detail/employer-summary-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Offers'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: EmployerSummaryComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: EmployerAddofferComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'addoffer/:id',
        component: EmployerAddofferComponent,
        data: {
          // title: 'edit offer'
        }
      }
      , {
        path: 'offerdetail/:id',
        component: EmployerSummaryDetailComponent,
        data: {
          // title: 'offerDetail'
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
