import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCustomFieldRoutingModule } from './manage-custom-field-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DataTablesModule } from 'angular-datatables';
import { AddCustomFieldComponent } from './add-custom-field/add-custom-field.component';
import { ListCustomFieldComponent } from './list-custom-field/list-custom-field.component';

@NgModule({
  declarations: [
    AddCustomFieldComponent,
    ListCustomFieldComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ManageCustomFieldRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmDialogModule
  ], providers: [ConfirmationService]
})
export class ManageCustomFieldModule { }
