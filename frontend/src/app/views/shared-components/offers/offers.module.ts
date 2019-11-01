import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffersRoutingModule } from './offers-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { OfferListComponent } from './offer-list/offer-list.component';
import { OfferAddViewComponent } from './offer-add-view/offer-add-view.component';
import { DataTablesModule } from 'angular-datatables';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    OfferListComponent,
    OfferAddViewComponent
  ],
  imports: [
    CommonModule,
    OffersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    DataTablesModule,
    DropdownModule,
    CalendarModule,
    InputSwitchModule,
    CKEditorModule,
    ConfirmDialogModule
  ], providers: [ConfirmationService]
})
export class OffersModule { }