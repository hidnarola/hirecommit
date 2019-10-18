import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerRoutingModule } from './employer-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DefaultLayoutModule } from '../../shared/containers/default-layout/default-layout.module';
import { TimelineComponent } from './timeline/timeline.component';
import { MglTimelineModule } from 'angular-mgl-timeline';

@NgModule({
  declarations: [
    TimelineComponent,
  ],
  imports: [
    CommonModule,
    EmployerRoutingModule,
    ReactiveFormsModule,
    DefaultLayoutModule,
    MglTimelineModule,
  ],
  providers: []

})

export class EmployerModule { }
