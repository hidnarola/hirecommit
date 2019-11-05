import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFieldsRoutingModule } from './custom-fields-routing.module';
import { CustomFieldListComponent } from './custom-field-list/custom-field-list.component';
import { CustomFieldAddViewComponent } from './custom-field-add-view/custom-field-add-view.component';
import { ConfirmationService } from 'primeng/api';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'ng2-tooltip-directive';
@NgModule({
  declarations: [
    CustomFieldListComponent,
    CustomFieldAddViewComponent
  ],
  imports: [
    CommonModule,
    CustomFieldsRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    FormsModule,
    ConfirmDialogModule,
    TooltipModule,
  ],
  providers: [ConfirmationService]
})
export class CustomFieldsModule { }
