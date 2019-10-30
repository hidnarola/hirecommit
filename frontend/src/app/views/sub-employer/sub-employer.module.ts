import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubEmployerRoutingModule } from './sub-employer-routing.module';
import { DefaultLayoutModule } from '../../shared/containers/default-layout/default-layout.module';
import { EmployerModule } from '../admin/employers/employer.module';
import { OffersModule } from '../shared-components/offers/offers.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SubEmployerRoutingModule,
    DefaultLayoutModule,
    EmployerModule,
    OffersModule
  ]
})
export class SubEmployerModule { }
