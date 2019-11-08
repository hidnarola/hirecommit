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
import { ReportComponent } from './report/report.component';
import { ReportHistoryComponent } from './report/report-history/report-history.component';
import { OffersModule } from '../../shared-components/offers/offers.module'
@NgModule({
  declarations: [
    EmployerListComponent,
    EmployerViewComponent,
    ReportComponent,
    ReportHistoryComponent,
    // OfferAddViewComponent
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    ConfirmDialogModule,
    TooltipModule,
    OffersModule
  ], providers: [ConfirmationService]

})
export class EmployerModule { }
