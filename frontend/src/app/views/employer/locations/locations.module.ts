import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationAddViewComponent } from './location-add-view/location-add-view.component';
import { LocationsListComponent } from './locations-list/locations-list.component';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    LocationAddViewComponent,
    LocationsListComponent
  ],
  imports: [
    CommonModule,
    LocationsRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    ConfirmDialogModule,
    DropdownModule,
    TooltipModule
  ],
  providers: [ConfirmationService]
})
export class LocationsModule { }
