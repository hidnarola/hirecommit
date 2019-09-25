import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ ChangepasswordComponent, ProfileComponent ],
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ]
})
export class SharedModule { }
