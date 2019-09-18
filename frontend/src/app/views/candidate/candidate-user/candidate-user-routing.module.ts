import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferlistComponent } from './offerlist/offerlist.component';
import { ViewofferDetailComponent } from './viewoffer-detail/viewoffer-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User'
    },
    children: [
      {
        path: '',
        redirectTo: 'offerlist'
      },
      {
        path: 'offerlist',
        component: OfferlistComponent,
        data: {
          title: 'OfferList'
        }
      },
      {
        path: 'offerdetail',
        component: ViewofferDetailComponent,
        data: {
          title: 'OfferDetail'
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
