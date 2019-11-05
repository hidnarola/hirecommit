import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferAddViewComponent } from './offer-add-view/offer-add-view.component';
import { TimelineComponent } from '../../employer/timeline/timeline.component';

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
        component: OfferListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: OfferAddViewComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'view/:id',
        component: OfferAddViewComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: OfferAddViewComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'history/:id',
        component: TimelineComponent,
        data: {
          title: 'History'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule { }
