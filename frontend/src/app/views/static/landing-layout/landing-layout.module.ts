import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingLayoutRoutingModule } from './landing-layout-routing.module';
import { LandingLayoutComponent } from './landing-layout.component';
import { CandidateLandingComponent } from '../candidate-landing/candidate-landing.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { EmployerLandingComponent } from '../employer-landing/employer-landing.component';


@NgModule({
  declarations: [
    // LandingLayoutComponent,
    // CandidateLandingComponent,
    // EmployerLandingComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    LandingLayoutRoutingModule
  ]
})
export class LandingLayoutModule { }
