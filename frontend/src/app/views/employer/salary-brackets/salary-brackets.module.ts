import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalaryBracketAddViewComponent } from './salary-bracket-add-view/salary-bracket-add-view.component';
import { SalaryBracketListComponent } from './salary-bracket-list/salary-bracket-list.component';
import { SalaryBracketsRoutingModule } from './salary-brackets-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    SalaryBracketAddViewComponent,
    SalaryBracketListComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    DropdownModule,
    SalaryBracketsRoutingModule
  ],
  providers: [ConfirmationService]
})
export class SalaryBracketsModule { }
