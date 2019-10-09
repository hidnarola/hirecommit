import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerRoutingModule } from './employer-routing.module';
import { ViewEmployerComponent } from './view-employer/view-employer.component';
import { AddEmployerComponent } from './add-employer/add-employer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmployerDetailComponent } from './employer-detail/employer-detail.component';
import { DataTablesModule } from 'angular-datatables';
import { RequestedEmployerComponent } from './requested-employer/requested-employer.component';

@NgModule({
  declarations: [ViewEmployerComponent, AddEmployerComponent, EmployerDetailComponent, RequestedEmployerComponent],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: []
})
export class EmployerModule { }
