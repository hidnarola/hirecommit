import { Component, OnInit } from '@angular/core';

import { OfferService } from '../../shared-components/offers/offer.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as  moment from 'moment';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  id: any;
  candidate: any = {};
  employer: any = [];
  offer: any = [];
  history: any[] = [];
  moment: any;
  userDetail: any;
  constructor(private service: OfferService,
    private route: ActivatedRoute,
    private commonservice: CommonService,
    private toastr: ToastrService,
    private router: Router) {

    this.userDetail = this.commonservice.getLoggedUserDetail();
  }

  ngOnInit() {
    this.moment = moment;
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.history(this.id).subscribe(res => {
      const history = res['data'];
      this.history = history;
      this.candidate = history['candidate'];
      this.employer = history['employer'];
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });

  }

  Back() {
    if (this.userDetail.role === 'employer') {
      this.router.navigate(['/employer/offers/list']);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['/sub_employer/offers/list']);
    }
  }



}
