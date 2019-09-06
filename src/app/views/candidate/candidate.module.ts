import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { NewcandidateListComponent } from './newcandidate-list/newcandidate-list.component';
import { NewcandidateDetailComponent } from './newcandidate-detail/newcandidate-detail.component';
import { CandidatedetailApproveComponent } from './candidatedetail-approve/candidatedetail-approve.component';

@NgModule({
  declarations: [CandidateListComponent, NewcandidateListComponent, NewcandidateDetailComponent, CandidatedetailApproveComponent],
  imports: [
    CommonModule,
    CandidateRoutingModule
  ]
})
export class CandidateModule { }
