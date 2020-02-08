import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-employer-landing',
  templateUrl: './employer-landing.component.html',
  styleUrls: ['./employer-landing.component.scss']
})
export class EmployerLandingComponent implements OnInit {
  current_url = '';
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  API_URL: String;
  header_bluepart: any = [];
  structured_automated: any = [];
  support_identity: any = [];
  transparency: any = [];
  data_security: any = [];
  candidate_joins: any = [];
  monitor_alert_communication: any = [];
  candidate_accept: any = [];
  one_time_setup: any = [];
  send_offer_to_candidate: any = [];
  signup_for_free: any = [];
  advance_alerts: any = [];
  landingForm: FormGroup;
  constructor(private location: Location, private service: CommonService, private spinner: NgxSpinnerService, ) {
    this.spinner.show();
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
    this.API_URL = environment.API_URL;
    this.landingForm = new FormGroup({
      email: new FormControl('')
    })
    this.service.employer_landing().subscribe(res => {
      this.spinner.hide();

      this.header_bluepart = res[`data`].header_bluepart;
      this.structured_automated = res[`data`].structured_automated;
      this.support_identity = res[`data`].support_identity;
      this.transparency = res[`data`].transparency;
      this.data_security = res[`data`].data_security;
      this.candidate_joins = res[`data`].candidate_joins;
      this.monitor_alert_communication = res[`data`].monitor_alert_communication;
      this.candidate_accept = res[`data`].candidate_accept;
      this.one_time_setup = res[`data`].one_time_setup;
      this.send_offer_to_candidate = res[`data`].send_offer_to_candidate;
      this.signup_for_free = res[`data`].signup_for_free;
      this.advance_alerts = res[`data`].advance_alerts;
    }, (err) => {
      this.spinner.hide();

    });


  }

  ngOnInit() {
    this.current_url = this.location.path();
  }

  signup(value) {
    let email = value.email;
    email = btoa(email);
    window.location.href = environment.employerURL + 'emp_register?email=' + email;
  }
}
