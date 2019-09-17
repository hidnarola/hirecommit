import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSubAccountsComponent } from './view-sub-accounts/view-sub-accounts.component';
import { SubAccountsDetailsComponent } from './sub-accounts-details/sub-accounts-details.component';
import { AddSubAccountsComponent } from './add-sub-accounts/add-sub-accounts.component';




const routes: Routes = [
  {
    path: '',
    data: {
      title:'Sub-Accounts'
    },
    children:[
      {
         path: 'addsubaccounts',
         component: AddSubAccountsComponent,
         data: {
           title: 'Add Sub-Account'
         }
      },
      {
        path: 'viewsubaccount',
        component: ViewSubAccountsComponent,
        data: {
          title: 'View Sub-Account'
        }
      },
      {
        path: 'subaccountdetail',
        component: SubAccountsDetailsComponent,
        data: {
          title: 'View Sub-Account Details'
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
