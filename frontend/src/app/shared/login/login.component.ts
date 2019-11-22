import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { AnimationQueryMetadata } from '@angular/animations';

@Component({
  selector: 'app-adminlayout',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  profile: any = {};
  loginForm: FormGroup;
  public isFormSubmitted;
  public formData: any;
  show_spinner = false;
  userData: any = {};
  role: any;
  constructor(
    public router: Router,
    private service: CommonService,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, this.noWhitespaceValidator, Validators.email]),
      password: new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)]))
    });


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
        this.isFormSubmitted = false;
        this.formData = {};
        const token = res['token'];
        localStorage.setItem('token', token);
        localStorage.setItem('user', res['role']);
        localStorage.setItem('userid', res['id']);
        this.role = res['role'];
        // if (res['role'] !== 'admin' && res['role'] !== 'sub-employer') {
        //   let countryId;
        //   countryId = res[`userDetails`][0].country ? res[`userDetails`][0].country._id : undefined;
        //   let documentId;
        //   documentId = res[`userDetails`][0].document ? res[`userDetails`][0].document._id : undefined;
        //   let businessId;
        //   businessId = res[`userDetails`][0].business ? res[`userDetails`][0].business._id : undefined;
        //   this.userData = {
        //     ...res[`data`],
        //     ...res[`userDetails`][0].userDetail,
        //     countryId,
        //     ...res[`userDetails`][0].country,
        //     documentId,
        //     ...res[`userDetails`][0].document,
        //     businessId,
        //     ...res[`userDetails`][0].business
        //   };
        //   this.service.setProfileDetail(this.userData);
        // }
        // if (res['role'] === 'sub-employer') {
        //   this.userData = {
        //     ...res[`data`],
        //   };
        //   this.service.setProfileDetail(this.userData);
        // }


        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        if (this.role === 'admin') {
          console.log('login>>', this.profile);
          this.router.navigate(['admin']);
        }
        if (res['role'] !== 'admin') {
          this.service.profileData().then(res => {
            console.log('res for profile data=>', res);

            this.profile = res[0];
            console.log('login>>', this.profile);
            if (this.role === 'employer') {
              console.log('employer=======>');

              if (this.profile.user_id.isAllow === false) {
                this.router.navigate(['employer/account_verification']);
              } else {
                this.router.navigate(['employer']);
              }
            } else if (this.role === 'sub-employer') {
              this.router.navigate(['sub_employer']);
            } else if (this.role === 'candidate') {
              if (this.profile.user_id.email_verified) {
                this.router.navigate(['candidate']);
              } else {
                this.router.navigate(['candidate/account_verification']);
              }
            }
          });
        }

      }, (err) => {
        this.show_spinner = false;
        console.log('err => ', err);
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    }
  }

  signup() {
    this.router.navigate(['/emp_register']);
  }

  signup1() {
    this.router.navigate(['/candidate_register']);
  }

  Onclick() {
    this.router.navigate(['/forgot_password']);
  }

}
