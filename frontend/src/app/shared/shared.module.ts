import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
// import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { LightboxModule } from 'primeng/lightbox';
@NgModule({
  declarations: [ChangepasswordComponent, ProfileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    LightboxModule
  ], providers: [ConfirmationService]
})
export class SharedModule { }
