import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSalarybracketComponent } from './add-salarybracket/add-salarybracket.component';
import { ViewSalarybracketComponent } from './view-salarybracket/view-salarybracket.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Salary Bracket'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'add_salarybracket',
        component: AddSalarybracketComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'add_salarybracket/:id',
        component: AddSalarybracketComponent,
        data: {
          title: 'Edit'
        }
      },

      {
        path: 'list',
        component: ViewSalarybracketComponent,
        data: {
          title: 'List'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagSalaryBracketRoutingModule { }
