import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { NewcandidateListComponent } from './newcandidate-list/newcandidate-list.component';
import { NewcandidateDetailComponent } from './newcandidate-detail/newcandidate-detail.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Candidate'
    },
    children: [
      {
        path: '',
        redirectTo: 'view'
      },
      {
        path: 'view',
        component: CandidateListComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'newcandidate',
        component: NewcandidateListComponent,
        data: {
          title: 'NewCandidate'
        }
      },
      {
        path: 'newcandidatedetail',
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
