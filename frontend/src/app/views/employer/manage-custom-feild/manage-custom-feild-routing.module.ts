import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomFeildComponent } from './add-custom-feild/add-custom-feild.component';
import { ListCustomFeildComponent } from './list-custom-feild/list-custom-feild.component';


const routes: Routes = [{
  path: '',
  data: {
    title: 'Custom Feild'
  },
  children: [
    {
      path: 'add',
      component: AddCustomFeildComponent,
      data: {
        title: 'Add Custom Feild'
      }
    },
    {
      path: 'list',
      component: ListCustomFeildComponent,
      data: {
        title: 'List Custom Feild'
      }
    },
    {
      path: 'edit/:id',
      component: AddCustomFeildComponent,
      data: {
        title: 'Edit Custom Feild'
      }
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCustomFeildRoutingModule { }
