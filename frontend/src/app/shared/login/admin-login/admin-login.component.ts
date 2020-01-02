import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {
  profile: any = {};
  loginForm: FormGroup;
  public isFormSubmitted;
  public formData: any;
  show_spinner = false;
  userData: any = {};
  role: any;
  siteKey = environment.captcha_site_key;
  isProd: Boolean = false;

  constructor(
    public router: Router,
    private service: CommonService,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)])),
      recaptcha: new FormControl('', [Validators.required]),
    });

    this.isProd = environment.production;
    console.log('this.isProd=>', this.isProd);
  }
  checkMail() {
    if (this.loginForm.value.email.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.loginForm.controls['email'].setValidators([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
    } else {
      this.loginForm.controls['email'].setValidators([Validators.required]);
    }
    this.loginForm.controls['email'].updateValueAndValidity();
  }

  ngOnInit() { }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      this.service.login(this.loginForm.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        const token = res['token'];
        this.role = res['role'];

        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });

        if (this.isProd) {
          window.location.href = `http://hirecommit.com/authorize?role=${this.role}&token=${token}`;
          // if (this.role === 'admin') {
          //   // this.router.navigate(['admin']);
          //   window.location.href = 'http://hirecommit.com/admin/employers/approved_employer';
          // }
          // if (res['role'] !== 'admin') {
          //   this.service.profileData().then(resp => {
          //     this.profile = resp[0];
          //     if (this.role === 'employer') {
          //       // this.router.navigate(['employer']);
          //       window.location.href = 'http://hirecommit.com/employer/offers/list';
          //     } else if (this.role === 'sub-employer') {
          //       // this.router.navigate(['sub_employer']);
          //       window.location.href = 'http://hirecommit.com/sub_employer/offers/list';
          //     } else if (this.role === 'candidate') {
          //       if (this.profile.user_id.email_verified) {
          //         // this.router.navigate(['candidate']);
          //         window.location.href = 'http://hirecommit.com/candidate/offers/list';
          //       } else if (!this.profile.user_id.email_verified) {
          //         // this.router.navigate(['candidate/account_verification']);
          //         window.location.href = 'http://hirecommit.com/candidate/account_verification';
          //       }
          //     }
          //   });
          // }

        } else {
          localStorage.setItem('token', token);
          localStorage.setItem('user', res['role']);
          localStorage.setItem('userid', res['id']);

          // window.location.href = `http://hirecommit.com/authorize?role=${this.role}&token=${token}`;
          // this.router.navigate(['authorize'], { queryParams: { role: this.role, token: token } });

          if (this.role === 'admin') {
            this.router.navigate(['admin']);
          }
          if (res['role'] !== 'admin') {
            this.service.profileData().then(resp => {
              this.profile = resp[0];
              console.log('profile => ', this.profile);
              if (this.role === 'employer') {
                this.router.navigate(['employer']);
              } else if (this.role === 'sub-employer') {
                this.router.navigate(['sub_employer']);
              } else if (this.role === 'candidate') {
                if (this.profile.user_id.email_verified) {
                  this.router.navigate(['candidate']);
                } else if (!this.profile.user_id.email_verified) {
                  this.router.navigate(['candidate/account_verification']);
                }
              }
            });
          }
        }
      }, (err) => {
        this.show_spinner = false;
        console.log('err => ', err['error']['isApproved']);
        if (err['error']['isApproved'] === false) {
          Swal.fire(
            {
              type: 'error',
              text: err['error']['message']
            }
          );
        }
        else {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        }
      });
      //   this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      // });
    }
    else {
      this.isFormSubmitted = true;
    }
  }


}
