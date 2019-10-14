import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageCustomFeildRoutingModule } from './manage-custom-feild-routing.module';
import { AddCustomFeildComponent } from './add-custom-feild/add-custom-feild.component';
import { ListCustomFeildComponent } from './list-custom-feild/list-custom-feild.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


@NgModule({
  declarations: [AddCustomFeildComponent, ListCustomFeildComponent],
  imports: [
    CommonModule,
    ManageCustomFeildRoutingModule,ReactiveFormsModule,FormsModule
  ]
})
export class ManageCustomFeildModule { }
