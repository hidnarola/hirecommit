import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { CommunicationViewComponent } from './communication-view/communication-view.component';
import { CommunicationAddEditComponent } from './communication-add-edit/communication-add-edit.component';
import { GroupAddEditComponent } from './group-add-edit/group-add-edit.component';

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
        component: GroupAddEditComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: GroupAddEditComponent,
        data: {
          title: 'Edit'
        }
      },
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
