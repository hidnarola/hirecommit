import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddGroupsComponent } from './add-groups/add-groups.component';
import { ViewGroupsComponent } from '../manage-groups/view-groups/view-groups.component';
import { GroupsDetailsComponent } from './groups-details/groups-details.component';
import { GroupsComponent } from './groups/groups.component';

const routes: Routes = [
 { path: '',
  data: {
    title: 'Groups'
  },
  children: [
  {
    path: 'add_group/:id',
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
    path: 'group_details/:id',
    component: GroupsDetailsComponent,
    data: {
      title: 'View Group Detail'
    }
  },
  {
    path: 'group',
    component: GroupsComponent,
    data: {
      title: 'Add Group'
    }
  }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageGroupsRoutingModule { }
