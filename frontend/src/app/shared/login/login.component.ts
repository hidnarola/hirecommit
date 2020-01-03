import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AnimationQueryMetadata } from '@angular/animations';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-adminlayout',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // profile: any = {};
  // loginForm: FormGroup;
  // public isFormSubmitted;
  // public formData: any;
  // show_spinner = false;
  // userData: any = {};
  // role: any;
  // isEmployer: Boolean = false;
  // isCandidate: Boolean = false;
  // isAdmin: Boolean = false;
  // constructor(
  //   public router: Router,
  //   private service: CommonService,
  //   public fb: FormBuilder,
  //   private toastr: ToastrService
  // ) {
  //   this.formData = {};
  //   this.loginForm = this.fb.group({
  //     email: new FormControl('', [Validators.required,
  //     Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
  //     password: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)]))
  //   });


  //   const prev_loc = document.referrer;
  //   if (prev_loc) {
  //     const prev_loc_arr = prev_loc.split('//');
  //     console.log('prev_loc_arr=>', prev_loc_arr);

  //     console.log('(prev_loc_arr[1].indexOf(`employer.hirecommit.com`)) >= 0=>', (prev_loc_arr[1].indexOf('employer.hirecommit.com')) >= 0);

  //     console.log('prev_loc_arr[1].indexOf(`candidate.hirecommit.com`)) >= 0=>', (prev_loc_arr[1].indexOf('candidate.hirecommit.com')) >= 0);

  //     if (prev_loc_arr && prev_loc_arr.length > 1) {
  //       if ((prev_loc_arr[1].indexOf('employer.hirecommit.com')) >= 0) {
  //         this.isEmployer = true;
  //       } else if ((prev_loc_arr[1].indexOf('candidate.hirecommit.com')) >= 0) {
  //         this.isCandidate = true;
  //       } else {
  //         this.isAdmin = true;
  //       }
  //     } else {
  //       console.log('else=======>');
  //       this.isAdmin = true;
  //     }

  //   } else {
  //     this.isAdmin = true;
  //   }
  //   console.log('login =======>', document.referrer);


  // }
  // checkMail() {
  //   if (this.loginForm.value.email.length > 0) {
  //     // tslint:disable-next-line: max-line-length
  //     this.loginForm.controls['email'].setValidators([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
  //   } else {
  //     this.loginForm.controls['email'].setValidators(null);
  //   }
  //   this.loginForm.controls['email'].updateValueAndValidity();
  // }

  // ngOnInit() {

  // }



  // // Remove white spaces
  // noWhitespaceValidator(control: FormControl) {
  //   if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
  //     const isWhitespace = (control.value || '').trim().length === 0;
  //     const isValid = !isWhitespace;
  //     return isValid ? null : { 'whitespace': true };
  //   }
  // }

  // onSubmit(valid) {
  //   this.isFormSubmitted = true;
  //   if (valid) {
  //     this.show_spinner = true;
  //     this.service.login(this.loginForm.value).subscribe(res => {
  //       this.isFormSubmitted = false;
  //       this.formData = {};
  //       const token = res['token'];
  //       localStorage.setItem('token', token);
  //       localStorage.setItem('user', res['role']);
  //       localStorage.setItem('userid', res['id']);
  //       this.role = res['role'];
  //       // if (res['role'] !== 'admin' && res['role'] !== 'sub-employer') {
  //       //   let countryId;
  //       //   countryId = res[`userDetails`][0].country ? res[`userDetails`][0].country._id : undefined;
  //       //   let documentId;
  //       //   documentId = res[`userDetails`][0].document ? res[`userDetails`][0].document._id : undefined;
  //       //   let businessId;
  //       //   businessId = res[`userDetails`][0].business ? res[`userDetails`][0].business._id : undefined;
  //       //   this.userData = {
  //       //     ...res[`data`],
  //       //     ...res[`userDetails`][0].userDetail,
  //       //     countryId,
  //       //     ...res[`userDetails`][0].country,
  //       //     documentId,
  //       //     ...res[`userDetails`][0].document,
  //       //     businessId,
  //       //     ...res[`userDetails`][0].business
  //       //   };
  //       //   this.service.setProfileDetail(this.userData);
  //       // }
  //       // if (res['role'] === 'sub-employer') {
  //       //   this.userData = {
  //       //     ...res[`data`],
  //       //   };
  //       //   this.service.setProfileDetail(this.userData);
  //       // }


  //       this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
  // if (this.role === 'admin') {
  //   console.log('login>>', this.profile);
  //   this.router.navigate(['admin']);
  // }
  // if (res['role'] !== 'admin') {
  //   this.service.profileData().then(resp => {
  //     this.profile = resp[0];
  //     if (this.role === 'employer') {
  //       //   if (this.profile.user_id.isAllow === false) {
  //       //     this.router.navigate(['employer/account_verification']);
  //       //   } else {
  //       this.router.navigate(['employer']);
  //       // }
  //     } else if (this.role === 'sub-employer') {
  //       this.router.navigate(['sub_employer']);
  //     } else if (this.role === 'candidate') {
  //       if (this.profile.user_id.email_verified) {
  //         this.router.navigate(['candidate']);
  //       } else if (!this.profile.user_id.email_verified) {
  //         this.router.navigate(['candidate/account_verification']);
  //       }
  //     }
  //   });
  // }

  //     }, (err) => {
  //       this.show_spinner = false;
  //       console.log('err => ', err);
  //       this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
  //     });
  //   }
  // }

  // signup() {
  //   this.router.navigate(['/emp_register']);
  // }

  // signup1() {
  //   this.router.navigate(['/candidate_register']);
  // }

  // Onclick() {
  //   this.router.navigate(['/forgot_password']);
  // }


  isEmployer: Boolean = false;
  isCandidate: Boolean = false;
  isAdmin: Boolean = false;
  hostName: any = '';
  isProd: Boolean = false;
  isStaging: Boolean = false;
  constructor() {
    this.isProd = environment.production;
    this.isStaging = environment.staging;
    this.hostName = window.location.hostname;
    if (this.hostName === 'employer.hirecommit.com' || this.hostName === 'employer.tanubhasin.com') {
      this.isEmployer = true;
    } else if (this.hostName === 'candidate.hirecommit.com' || this.hostName === 'candidate.tanubhasin.com') {
      this.isCandidate = true;
    } else {
      this.isAdmin = true;
    }
  }

  ngOnInit() {

  }


}
