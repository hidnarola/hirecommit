import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { LocationAddViewComponent } from './location-add-view/location-add-view.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Locations'
    },
    // redirectTo: 'list'
    children: [
      {
        path: '',
        // data: {
        //   title: 'Locations'
        // },
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: LocationsListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: LocationAddViewComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: LocationAddViewComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: LocationAddViewComponent,
        data: {
          title: 'View'
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
