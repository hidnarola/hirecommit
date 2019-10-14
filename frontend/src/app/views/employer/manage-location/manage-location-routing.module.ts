import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLocationComponent } from './add-location/add-location.component';
import { ViewLocationComponent } from './view-location/view-location.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Location'
    },
    children: [
      {
        path: 'add_location',
        component: AddLocationComponent,
        data: {
          title: 'Add Location'
        }
      },
      {
        path: 'edit_location/:id',
        component: AddLocationComponent,
        data: {
          title: 'Edit Location'
        }
      },
      {
        path: 'view_location',
        component: ViewLocationComponent,
        data: {
          title: 'View Location'
        }
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageLocationRoutingModule { }
