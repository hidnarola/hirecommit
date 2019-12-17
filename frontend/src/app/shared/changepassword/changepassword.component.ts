import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  form: FormGroup;
  submitform: FormGroup;
  public isFormSubmitted;
  public formData: any;
  token: any;
  userDetail: any;
  show_spinner = false;
  _profile_data: any;
  isDisabled = false;
  constructor(
    private router: Router,
    public fb: FormBuilder,
    public service: CommonService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
  ) {
    this.formData = {};
    this.form = this.fb.group({
      'oldpassword': new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      'newpassword': new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      'confirmnewpassword': new FormControl('', [Validators.required, this.noWhitespaceValidator])
    }, { validator: this.checkPasswords });
    this.userDetail = this.commonService.getLoggedUserDetail();

    this.commonService.profileData().then(res => {
      this._profile_data = res[0];
      if (this._profile_data.user_id.is_login_first === false) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    });

  }

  checkPassword() {
    console.log('this.form.value.oldpassword=>', this.form.value.oldpassword);
    this.commonService.match_old_password({ 'oldpassword': this.form.value.oldpassword, 'id': this.userDetail.id }).subscribe(res => {
    }, (err) => {
      this.form.controls['oldpassword'].setErrors({ 'isExist': true });
      this.form.updateValueAndValidity();
    });
  }

  send() {
    if (this.userDetail.role === 'employer') {
      this.router.navigate(['/employer/offers/list']);
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['/candidate/offers/list']);
    } else if (this.userDetail.role === 'admin') {
      this.router.navigate(['/admin/employers/approved_employer']);
    } else if (this.userDetail.role === 'sub-employer') {
      if (this._profile_data.user_id.is_login_first === true) {
        this.router.navigate(['/sub_employer/offers/list']);

      } else {
        this.isDisabled = true;
      }
      this.commonService.firstLogin(this._profile_data.user_id.is_login_first);
    }


  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  submit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      this.submitform = new FormGroup({
        token: new FormControl(this.token),
        oldpassword: new FormControl(this.form.value.oldpassword),
        newpassword: new FormControl(this.form.value.newpassword)
      });
      this.confirmationService.confirm({
        message: 'Are you sure that you want to change your password?',
        accept: () => {
          this.service.change_password(this.submitform.value).subscribe(res => {
            this.isFormSubmitted = false;
            if (res['status'] === 1) {
              this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
              if (this.userDetail.role === 'employer') {
                this.router.navigate(['/employer/offers/list']);
              } else if (this.userDetail.role === 'candidate') {
                this.router.navigate(['/candidate/offers/list']);
              } else if (this.userDetail.role === 'admin') {
                this.router.navigate(['/admin/employers/approved_employer']);
              } else if (this.userDetail.role === 'sub-employer') {
                // this._profile_data[0].user_id.is_login_first = true;
                this.commonService.firstLogin(this._profile_data.user_id.is_login_first);
                this._profile_data.user_id.is_login_first = this.isDisabled;

                // this.commonService.setProfileDetail(this._profile_data[0].user_id);
                console.log('=>', this._profile_data);
                this.router.navigate(['/sub_employer/offers/list']);
              }
            }
          }, (err) => {
            console.log('err => ', err);
            this.show_spinner = false;
            this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
          });
        }
      });
    }
  }

  checkPasswords(g: FormGroup) {
    const password = g.get('newpassword').value;
    const confirmpassword = g.get('confirmnewpassword').value;
    if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
      return password === confirmpassword ? null : g.get('confirmnewpassword').setErrors({ 'mismatch': true });
    }
  }

}
