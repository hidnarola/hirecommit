import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagSalaryBracketRoutingModule } from './manag-salary-bracket-routing.module';
import { ViewSalarybracketComponent } from './view-salarybracket/view-salarybracket.component';
import { AddSalarybracketComponent } from './add-salarybracket/add-salarybracket.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [ViewSalarybracketComponent, AddSalarybracketComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    ConfirmDialogModule,
    ManagSalaryBracketRoutingModule, ReactiveFormsModule, DropdownModule
  ],
  providers: [ConfirmationService]
})
export class ManagSalaryBracketModule { }


