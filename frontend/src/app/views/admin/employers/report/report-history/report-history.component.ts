import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../../employer.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as  moment from 'moment';
import { CommonService } from '../../../../../services/common.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.scss']
})
export class ReportHistoryComponent implements OnInit {
  id: any;
  candidate: any = {};
  employer: any = [];
  offer: any = [];
  history: any[] = [];
  moment: any;
  userDetail: any;
  constructor(private service: EmployerService,
    private route: ActivatedRoute,
    private router: Router,
    private commonservice: CommonService,
    private _location: Location
  ) {
    this.userDetail = this.commonservice.getLoggedUserDetail();
    console.log('this.route.snapshot=>', this.route.snapshot);

    // this.route.params.subscribe((params: Params) => {
    //   this.id = params['id'];
    // });
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
    });

  }
  Back() {
    if (this.userDetail.role === 'admin') {

      this._location.back();

    }
  }


}
