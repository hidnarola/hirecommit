import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddLocationComponent } from './add-location/add-location.component';
import { ViewLocationComponent } from './view-location/view-location.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Locations'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'add',
        component: AddLocationComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit_location/:id',
        component: AddLocationComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'list',
        component: ViewLocationComponent,
        data: {
          title: 'List'
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
