import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSubAccountsComponent } from './view-sub-accounts/view-sub-accounts.component';




const routes: Routes = [
  {
    path: '',
    data: {
      title:'Sub-Accounts'
    },
    children:[
      {
        path: 'viewsubaccount',
        component: ViewSubAccountsComponent,
        data: {
          title: 'View Sub-account'
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
