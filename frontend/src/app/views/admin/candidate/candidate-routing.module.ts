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
      title: 'Candidates'
    },
    children: [
      {
        path: '',
        redirectTo: 'new_candidate'
      },
      {
        path: 'approved_candidate',
        component: CandidateListComponent,
        data: {
          title: 'Approved Candidate'
        }
      },
      {
        path: 'candidate_detail/:id',
        component: CandidatedetailApproveComponent,
        data: {
          title: 'Approved Candidate Detail'
        }
      },
      {
        path: 'new_candidate',
        component: NewcandidateListComponent,
        data: {
          title: 'New Candidate'
        }
      },
      {
        path: 'newcandidate_detail/:id',
        component: NewcandidateDetailComponent,
        data: {
          title: 'New Candidate Detail'
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
