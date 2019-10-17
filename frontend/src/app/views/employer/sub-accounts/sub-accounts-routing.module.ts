import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubAccountAddViewComponent } from './sub-account-add-view/sub-account-add-view.component';
import { SubAccountsListComponent } from './sub-accounts-list/sub-accounts-list.component';

const routes: Routes = [
  {
    path: '',
    // redirectTo: 'list',
    data: {
      title: 'Sub Accounts'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        // data: {
        //   title: 'Sub Accounts'
        // },
      },
      {
        path: 'list',
        component: SubAccountsListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: SubAccountAddViewComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: SubAccountAddViewComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'view/:id',
        component: SubAccountAddViewComponent,
        data: {
          title: 'View'
        }
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAccountsRoutingModule { }
