import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { EmployerModule } from './employer/employer.module';
import { CandidateModule } from './candidate/candidate.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { DefaultLayoutModule } from '../../shared/containers/default-layout/default-layout.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DefaultLayoutModule,
    EmployerModule,
    FormsModule,
    ReactiveFormsModule,
    CandidateModule,
    MglTimelineModule
  ]
})
export class AdminModule { }
