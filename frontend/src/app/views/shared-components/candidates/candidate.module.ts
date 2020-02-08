import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'ng2-tooltip-directive';
import { LightboxModule } from 'primeng/lightbox';
@NgModule({
  declarations: [
    CandidateListComponent,
    CandidateViewComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    ConfirmDialogModule,
    DataTablesModule,
    TooltipModule,
    LightboxModule
  ], providers: [ConfirmationService]
})
export class CandidateModule { }
