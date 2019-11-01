import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { EmployerModule } from './employers/employer.module';
import { CandidateModule } from '../shared-components/candidates/candidate.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MglTimelineModule } from 'angular-mgl-timeline';
import { DefaultLayoutModule } from '../../shared/containers/default-layout/default-layout.module';
import { TooltipModule } from 'ng2-tooltip-directive';

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
    MglTimelineModule,
    TooltipModule,
  ]
})
export class AdminModule { }
