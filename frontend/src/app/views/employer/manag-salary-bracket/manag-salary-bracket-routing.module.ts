import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddSalarybracketComponent } from './add-salarybracket/add-salarybracket.component';
import { ViewSalarybracketComponent } from './view-salarybracket/view-salarybracket.component';

const routes: Routes = [
  { path: '',
  data: {
    title: 'Salary-bracket'
  },
  children: [
  {
    path: 'add_salarybracket/:id',
    component: AddSalarybracketComponent,
    data: {
      title: 'Add Salary-bracket'
    }
  },

  {
    path: 'view_salarybracket',
  component: ViewSalarybracketComponent,
    data: {
      title: 'View Salary-bracket'
    }
  }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagSalaryBracketRoutingModule { }
