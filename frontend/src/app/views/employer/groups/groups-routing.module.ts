import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { CommunicationViewComponent } from './communication-view/communication-view.component';
import { CommunicationAddEditComponent } from './communication-add-edit/communication-add-edit.component';
import { GroupAddEditComponent } from './group-add-edit/group-add-edit.component';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupEditComponent } from './group-edit/group-edit.component';

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
        // component: GroupAddEditComponent,
        component: GroupAddComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        // component: GroupEditComponent,
        component: GroupAddEditComponent,
        data: {
          title: 'Edit'
        }
      },
      // {
      //   path: 'view/:id',
      //   // component: GroupEditComponent,
      //   component: GroupAddEditComponent,
      //   data: {
      //     title: 'View'
      //   }
      // },
      {
        path: 'communication/add',
        component: CommunicationAddEditComponent,
        data: {
          title: 'Add Communication'
        }
      },
      {
        path: 'communication/edit/:id',
        component: CommunicationAddEditComponent,
        data: {
          title: 'Edit Communication'
        }
      },
      {
        path: 'communication/view/:id',
        component: CommunicationViewComponent,
        data: {
          title: 'View Communication'
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
