import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalaryBracketListComponent } from './salary-bracket-list/salary-bracket-list.component';
import { SalaryBracketAddViewComponent } from './salary-bracket-add-view/salary-bracket-add-view.component';

const routes: Routes = [

  {
    path: '',
    // redirectTo: 'list',
    data: {
      title: 'Salary Bracket'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        // data: {
        //   title: 'Salary Bracket'
        // },
      },
      {
        path: 'list',
        component: SalaryBracketListComponent,
        data: {
          title: 'List'
        }
      },
      {
        path: 'add',
        component: SalaryBracketAddViewComponent,
        data: {
          title: 'Add'
        }
      },
      {
        path: 'view/:id',
        component: SalaryBracketAddViewComponent,
        data: {
          title: 'View'
        }
      },
      {
        path: 'edit/:id',
        component: SalaryBracketAddViewComponent,
        data: {
          title: 'Edit'
        }
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryBracketsRoutingModule { }
