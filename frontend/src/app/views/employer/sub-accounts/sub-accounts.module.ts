import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SubAccountsRoutingModule } from './sub-accounts-routing.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { SubAccountAddViewComponent } from './sub-account-add-view/sub-account-add-view.component';
import { SubAccountsListComponent } from './sub-accounts-list/sub-accounts-list.component';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    SubAccountAddViewComponent,
    SubAccountsListComponent
  ],
  imports: [
    CommonModule,
    SubAccountsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    ConfirmDialogModule,
    TooltipModule,
    InputSwitchModule
  ],
  providers: [ConfirmationService]
})
export class SubAccountsModule { }
