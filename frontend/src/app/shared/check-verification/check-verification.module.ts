import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckVerificationRoutingModule } from './check-verification-routing.module';
import { CheckVerificationComponent } from './check-verification.component';

@NgModule({
  declarations: [
    CheckVerificationComponent
  ],
  imports: [
    CommonModule,
    CheckVerificationRoutingModule
  ]
})
export class CheckVerificationModule { }
