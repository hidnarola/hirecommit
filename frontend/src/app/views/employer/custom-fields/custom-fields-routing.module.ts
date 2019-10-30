import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomFieldListComponent } from './custom-field-list/custom-field-list.component';
import { CustomFieldAddViewComponent } from './custom-field-add-view/custom-field-add-view.component';

const routes: Routes = [

  {
    path: '',
    data: {
      title: 'Custom Fields'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        // data: {
        //   title: 'Custom Field'
        // },
      },
      {
        path: 'list',
        component: CustomFieldListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: CustomFieldAddViewComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: CustomFieldAddViewComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: CustomFieldAddViewComponent,
        data: {
          title: 'View'
        }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFieldsRoutingModule { }
