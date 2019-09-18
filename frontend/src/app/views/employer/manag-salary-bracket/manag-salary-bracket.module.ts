import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagSalaryBracketRoutingModule } from './manag-salary-bracket-routing.module';
import { ViewSalarybracketComponent } from './view-salarybracket/view-salarybracket.component';
import { AddSalarybracketComponent } from './add-salarybracket/add-salarybracket.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ViewSalarybracketComponent, AddSalarybracketComponent],
  imports: [
    CommonModule,
    ManagSalaryBracketRoutingModule,ReactiveFormsModule
  ]
})
export class ManagSalaryBracketModule { }
