import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  profile: any = {};
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  constructor(private spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute, private service: CommonService, ) {
    this.spinner.show();
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
    this.activatedRoute.queryParams.subscribe((res) => {
      localStorage.setItem('token', res['token']);
      localStorage.setItem('user', res['role']);
      if (environment.env === 'staging' || environment.env === 'prod') {
        if (res['role'] === 'admin') {
          // this.router.navigate(['admin']);
          window.location.href = this.mainURL + 'admin/employers/approved_employer';
          this.spinner.hide();
        } else {
          this.service.profileData().then(resp => {
            this.profile = resp[0];
            if (res['role'] === 'employer') {
              window.location.href = this.mainURL + 'employer/offers/list';
              this.spinner.hide();
            } else if (res['role'] === 'sub-employer') {
              window.location.href = this.mainURL + 'sub_employer/offers/list';
              this.spinner.hide();
            } else if (res['role'] === 'candidate') {
              if (this.profile.user_id.email_verified) {
                window.location.href = this.mainURL + 'candidate/offers/list';
                this.spinner.hide();
              } else if (!this.profile.user_id.email_verified) {
                window.location.href = this.mainURL + 'candidate/account_verification';
                this.spinner.hide();
              }
            }
          });
        }
      } else {

      }

    });
  }

  ngOnInit() {
  }

}
