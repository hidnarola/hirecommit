import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  profile: any = {};

  constructor(private spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute, private service: CommonService, ) {
    this.spinner.show();
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log('res => ', res);
      localStorage.setItem('token', res['token']);
      localStorage.setItem('user', res['role']);
      if (res['role'] === 'admin') {
        // this.router.navigate(['admin']);
        window.location.href = 'http://hirecommit.com/admin/employers/approved_employer';
        this.spinner.hide();
      } else {
        this.service.profileData().then(resp => {
          this.profile = resp[0];
          if (res['role'] === 'employer') {
            // this.router.navigate(['employer']);
            window.location.href = 'http://hirecommit.com/employer/offers/list';
            this.spinner.hide();
          } else if (res['role'] === 'sub-employer') {
            // this.router.navigate(['sub_employer']);
            window.location.href = 'http://hirecommit.com/sub_employer/offers/list';
            this.spinner.hide();
          } else if (res['role'] === 'candidate') {
            if (this.profile.user_id.email_verified) {
              // this.router.navigate(['candidate']);
              window.location.href = 'http://hirecommit.com/candidate/offers/list';
              this.spinner.hide();
            } else if (!this.profile.user_id.email_verified) {
              // this.router.navigate(['candidate/account_verification']);
              window.location.href = 'http://hirecommit.com/candidate/account_verification';
              this.spinner.hide();
            }
          }
        });
      }
    });
  }

  ngOnInit() {
  }

}
