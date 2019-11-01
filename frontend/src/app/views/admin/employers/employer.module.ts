import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerRoutingModule } from './employer-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { EmployerListComponent } from './employer-list/employer-list.component';
import { EmployerViewComponent } from './employer-view/employer-view.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    EmployerListComponent,
    EmployerViewComponent
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ConfirmDialogModule,
    TooltipModule
  ], providers: [ConfirmationService]

})
export class EmployerModule { }
