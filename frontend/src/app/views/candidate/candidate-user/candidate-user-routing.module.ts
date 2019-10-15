import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferlistComponent } from './offerlist/offerlist.component';
import { ViewofferDetailComponent } from './viewoffer-detail/viewoffer-detail.component';

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
        component: OfferlistComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'view',
        component: ViewofferDetailComponent,
        data: {
          title: 'View'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateUserRoutingModule { }
