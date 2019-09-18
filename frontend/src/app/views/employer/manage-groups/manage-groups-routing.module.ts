import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGroupsComponent } from './add-groups/add-groups.component';
import { ViewGroupsComponent } from '../manage-groups/view-groups/view-groups.component';
import { GroupsDetailsComponent } from './groups-details/groups-details.component';

const routes: Routes = [
 { path: '',
  data: {
    title: 'Groups'
  },
  children: [
  {
    path: 'add_group',
    component: AddGroupsComponent,
    data: {
      title: 'Add Group'
    }
  },

  {
    path: 'view_group',
  component: ViewGroupsComponent,
    data: {
      title: 'View Groups'
    }
  },
  {
    path: 'group_details',
    component: GroupsDetailsComponent,
    data: {
      title: 'View Group Detail'
    }
  }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageGroupsRoutingModule { }
