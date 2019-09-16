import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateUserRoutingModule } from './candidate-user-routing.module';
import { OfferlistComponent } from './offerlist/offerlist.component';
import { ViewofferDetailComponent } from './viewoffer-detail/viewoffer-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ng2-tooltip-directive';
import { manageusercomponent } from '../../shared/manageuser';

@NgModule({
  declarations: [OfferlistComponent, ViewofferDetailComponent],
  imports: [
    CommonModule,
    CandidateUserRoutingModule,
    ReactiveFormsModule,
    TooltipModule
  ],
  providers: [manageusercomponent]
})
export class CandidateUserModule { }
