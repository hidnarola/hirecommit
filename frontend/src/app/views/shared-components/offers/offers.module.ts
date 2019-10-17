import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersRoutingModule } from './offers-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferAddViewComponent } from './offer-add-view/offer-add-view.component';
import { DataTablesModule } from 'angular-datatables';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    OfferListComponent,
    OfferAddViewComponent
  ],
  imports: [
    CommonModule,
    OffersRoutingModule,
    ReactiveFormsModule,
    TooltipModule,
    DataTablesModule,
    DropdownModule,
    CalendarModule
  ]
})
export class OffersModule { }
