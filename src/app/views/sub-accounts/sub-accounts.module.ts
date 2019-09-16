import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAccountsRoutingModule } from './sub-accounts-routing.module';


import { ReactiveFormsModule } from '@angular/forms';
import { ViewSubAccountsComponent } from './view-sub-accounts/view-sub-accounts.component';



@NgModule({
  declarations: [ViewSubAccountsComponent],
  imports: [
    CommonModule,
    SubAccountsRoutingModule,
    ReactiveFormsModule
  ]
})
export class SubAccountsModule { }
