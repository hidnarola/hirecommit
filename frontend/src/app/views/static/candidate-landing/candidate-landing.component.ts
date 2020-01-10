import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-candidate-landing',
  templateUrl: './candidate-landing.component.html',
  styleUrls: ['./candidate-landing.component.scss']
})
export class CandidateLandingComponent implements OnInit {

  landingForm: FormGroup;
  current_url = '';
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  API_URL: String;
  support_identity: any = [];
  transparency: any = [];
  data_security: any = [];
  join_company: any = [];
  accept_offer: any = [];
  receive_offers: any = [];
  signup_for_free: any = [];
  header_bluepart: any = [];
  constructor(private location: Location, private service: CommonService) {
    this.landingForm = new FormGroup({
      email: new FormControl('')
    })
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
    this.API_URL = environment.API_URL;
    this.service.candidate_landing().subscribe(res => {
      this.header_bluepart = res[`data`].header_bluepart;
      this.signup_for_free = res[`data`].signup_for_free;
      this.receive_offers = res[`data`].receive_offers;
      this.accept_offer = res[`data`].accept_offer;
      this.join_company = res[`data`].join_company;
      this.data_security = res[`data`].data_security;
      this.transparency = res[`data`].transparency;
      this.support_identity = res[`data`].support_identity;
    });
  }

  ngOnInit() {
    this.current_url = this.location.path();
  }
  singup(value) {
    let email = value.email;
    email = btoa(email);
    window.location.href = environment.candidateURL + 'candidate_register?email=' + email;
  }

}
