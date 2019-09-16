import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGroupsComponent } from './add-groups/add-groups.component';
import { ViewGroupsComponent } from '../manage-groups/view-groups/view-groups.component';


const routes: Routes = [
 { path: '',
  data: {
    title:'Groups'
  },
  children: [
  {
    path: 'addgroup',
    component: AddGroupsComponent,
    data: {
      title: 'Add Group'
    }
  },

  {
    path: 'viewgroups',
  component: ViewGroupsComponent,
    data: {
      title: 'View Groups'
    }
  }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageGroupsRoutingModule { }
