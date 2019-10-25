import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupViewComponent } from './group-view/group-view.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'list',
    data: {
      title: 'Groups'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        // data: {
        //   title: 'Groups'
        // },
      },
      {
        path: 'list',
        component: GroupsListComponent,
        data: {
          title: 'List'
        },
      },
      {
        path: 'add',
        component: GroupAddComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: GroupEditComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: GroupViewComponent,
        // component: GroupEditComponent,
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
export class GroupsRoutingModule { }
