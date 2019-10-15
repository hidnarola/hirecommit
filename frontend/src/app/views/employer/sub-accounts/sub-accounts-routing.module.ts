import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSubAccountsComponent } from './view-sub-accounts/view-sub-accounts.component';
import { SubAccountsDetailsComponent } from './sub-accounts-details/sub-accounts-details.component';
import { AddSubAccountsComponent } from './add-sub-accounts/add-sub-accounts.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sub Accounts'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'add',
        component: AddSubAccountsComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'edit/:id',
        component: AddSubAccountsComponent,
        data: {
          title: 'Edit'
        }
      },
      {
        path: 'list',
        component: ViewSubAccountsComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'sub_accountdetail',
        component: SubAccountsDetailsComponent,
        data: {
          title: 'View'
        }
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubAccountsRoutingModule { }
