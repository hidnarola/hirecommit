import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@NgModule({
  declarations: [ChangepasswordComponent, ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule
  ], providers: [ConfirmationService]
})
export class SharedModule { }
