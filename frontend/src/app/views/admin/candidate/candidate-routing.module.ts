import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { NewcandidateListComponent } from './newcandidate-list/newcandidate-list.component';
import { NewcandidateDetailComponent } from './newcandidate-detail/newcandidate-detail.component';
import { CandidatedetailApproveComponent } from './candidatedetail-approve/candidatedetail-approve.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Candidate'
    },
    children: [
      {
        path: '',
        redirectTo: 'approve_candidate'
      },
      {
        path: 'approve_candidate',
        component: CandidateListComponent,
        data: {
          title: 'ApproveCandidate'
        }
      },
      {
        path: 'candidate_detail',
        component: CandidatedetailApproveComponent,
        data: {
          title: 'ApproveCandidateDetail'
        }
      },
      {
        path: 'new_candidate',
        component: NewcandidateListComponent,
        data: {
          title: 'NewCandidate'
        }
      },
      {
        path: 'newcandidate_detail',
        component: NewcandidateDetailComponent,
        data: {
          title: 'NewCandidateDetail'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
