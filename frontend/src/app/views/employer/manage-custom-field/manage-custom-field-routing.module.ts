import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomFieldComponent } from './add-custom-field/add-custom-field.component';
import { ListCustomFieldComponent } from './list-custom-field/list-custom-field.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Custom Field'
  },
  children: [
    {
      path: '',
      redirectTo: 'list'
    },
    {
      path: 'add',
      component: AddCustomFieldComponent,
      data: {
        title: 'Add'
      }
    },
    {
      path: 'list',
      component: ListCustomFieldComponent,
      data: {
        title: 'List'
      }
    },
    {
      path: 'edit/:id',
      component: AddCustomFieldComponent,
      data: {
        title: 'Edit'
      }
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCustomFieldRoutingModule { }
