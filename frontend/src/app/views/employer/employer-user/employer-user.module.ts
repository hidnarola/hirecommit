import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerUserRoutingModule } from './employer-user-routing.module';
import { EmployerSummaryComponent } from './employer-summary/employer-summary.component';
import { EmployerAddofferComponent } from './employer-addoffer/employer-addoffer.component';
import { EmployerSummaryDetailComponent } from './employer-summary-detail/employer-summary-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [EmployerSummaryComponent, EmployerAddofferComponent, EmployerSummaryDetailComponent],
  imports: [
    CommonModule,
    EmployerUserRoutingModule,
  ReactiveFormsModule]
})
export class EmployerUserModule { }
