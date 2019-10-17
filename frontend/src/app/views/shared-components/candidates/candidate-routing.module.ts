import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateListComponent } from './candidate-list/candidate-list.component';
import { CandidateViewComponent } from './candidate-view/candidate-view.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'approved_candidate'
  }, {
    path: '',
    children: [
      {
        path: 'approved_candidate',
        component: CandidateListComponent,
        data: {
          title: 'Approved Candidates',
          type: 'approved'
        }
      },
      {
        path: 'approved_candidate/view/:id',
        component: CandidateViewComponent,
        data: {
          title: 'View Approved Candidates',
          type: 'approved'
        }
      },
      {
        path: 'new_candidate',
        component: CandidateListComponent,
        data: {
          title: 'New Candidates',
          type: 'new'
        }
      },
      {
        path: 'new_candidate/view/:id',
        component: CandidateViewComponent,
        data: {
          title: 'View New Candidates',
          type: 'new'
        }
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
