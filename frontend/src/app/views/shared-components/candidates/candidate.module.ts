import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';
import { CandidateListComponent } from './candidate-list/candidate-list.component';

@NgModule({
  declarations: [
    CandidateListComponent,
    CandidateViewComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    DataTablesModule
  ],
  providers: []
})
export class CandidateModule { }
