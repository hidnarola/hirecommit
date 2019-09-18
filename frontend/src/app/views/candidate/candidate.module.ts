import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateRoutingModule } from './candidate-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DefaultLayoutModule } from '../../shared/containers/default-layout/default-layout.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    FormsModule,
    DefaultLayoutModule,
    ReactiveFormsModule
  ]
})
export class CandidateModule { }
