import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-candidate-login',
  templateUrl: './candidate-login.component.html',
  styleUrls: ['./candidate-login.component.scss']
})
export class CandidateLoginComponent implements OnInit {

  profile: any = {};
  loginForm: FormGroup;
  public isFormSubmitted;
  public formData: any;
  show_spinner = false;
  userData: any = {};
  role: any;
  siteKey = environment.captcha_site_key;
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

  }

  checkMail() {
    if (this.loginForm.value.email.length > 0) {
      // tslint:disable-next-line: max-line-length
      this.loginForm.controls['email'].setValidators([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
    } else {
      this.loginForm.controls['email'].setValidators(null);
    }
    this.loginForm.controls['email'].updateValueAndValidity();
  }

  ngOnInit() {

  }

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
        console.log('res for login => ', res);
        this.isFormSubmitted = false;
        this.formData = {};
        const token = res['token'];
        // localStorage.setItem('token', token);
        // localStorage.setItem('user', res['role']);
        // localStorage.setItem('userid', res['id']);
        this.role = res['role'];
        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });

        window.location.href = `http://hirecommit.com/authorize?role=${this.role}&token=${token}`;

        // if (this.role === 'admin') {
        //   // this.router.navigate(['admin']);
        //   window.location.href = 'http://hirecommit.com/admin/employers/approved_employer';
        // }
        // if (res['role'] !== 'admin') {
        //   this.service.profileData().then(resp => {
        //     console.log('resp => ', resp);
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

      }, (err) => {
        this.show_spinner = false;
        console.log('err here => ', err['error']['isApproved']);
        if (err['error']['isApproved'] === false) {
          Swal.fire(
            {
              type: 'error',
              text: err['error']['message']
            }
          );
        }
        else {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        }
      });
    }
  }


}

