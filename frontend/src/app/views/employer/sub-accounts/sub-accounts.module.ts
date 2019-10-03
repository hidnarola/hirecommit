import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubAccountsRoutingModule } from './sub-accounts-routing.module';

import { ReactiveFormsModule } from '@angular/forms';
import { ViewSubAccountsComponent } from './view-sub-accounts/view-sub-accounts.component';
import { SubAccountsDetailsComponent } from './sub-accounts-details/sub-accounts-details.component';
import { AddSubAccountsComponent } from './add-sub-accounts/add-sub-accounts.component';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ViewSubAccountsComponent, SubAccountsDetailsComponent, AddSubAccountsComponent],
  imports: [
    CommonModule,
    SubAccountsRoutingModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class SubAccountsModule { }
