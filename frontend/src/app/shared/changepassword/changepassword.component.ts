import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class ChangepasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  submitform: FormGroup;
  public isFormSubmitted;
  istouchedArray = [];
  public formData: any = {};
  token: any;
  data: any;
  userDetail: any;
  show_spinner = false;
  _profile_data: any;
  detail: any;
  isDisabled = false;
  currentUrl = '';
  isSubmit = false;
  constructor(
    private router: Router,
    public fb: FormBuilder,
    public service: CommonService,
    private toastr: ToastrService,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
  ) {
    this.formData = {};
    this.currentUrl = this.router.url;
    this.forminit();
    this.userDetail = this.commonService.getLoggedUserDetail();

    this.commonService.profileData().then(res => {
      this._profile_data = res[0];
      if (this._profile_data.user_id.is_login_first === false && !(this.userDetail.role === 'candidate')) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    });

  }

  forminit = () => {
    this.form = this.fb.group({
      'oldpassword': new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          // Validators.minLength(8),
          // Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)
        ])),
      'newpassword': new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      'confirmnewpassword': new FormControl('', [Validators.required, this.noWhitespaceValidator])
    }, { validator: this.checkPasswords });
  }

  checkPassword() {
    this.commonService.match_old_password({ 'oldpassword': this.form.value.oldpassword, 'id': this.userDetail.id }).subscribe(res => {
    }, (err) => {
      this.form.controls['oldpassword'].setErrors({ 'isExist': true });
      this.form.updateValueAndValidity();
    });
  }

  send() {
    this.isSubmit = true;
    this.commonService.setuserData('');
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
    this.commonService.getuserdata.subscribe(res => {

      if (res !== '') {
        this.formData = { ...res };
      } else {
        this.forminit();
      }

    });
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
    this.isSubmit = true;
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
            this.commonService.setuserData('');
            if (res['status'] === 1) {
              this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
              if (this.userDetail.role === 'employer') {
                this.router.navigate(['/employer/offers/list']);
              } else if (this.userDetail.role === 'candidate') {
                this.router.navigate(['/candidate/offers/list']);
              } else if (this.userDetail.role === 'admin') {
                this.router.navigate(['/admin/employers/approved_employer']);
              } else if (this.userDetail.role === 'sub-employer') {

                this._profile_data.user_id.is_login_first = true;
                this.commonService.firstLogin(this._profile_data.user_id.is_login_first);
                this._profile_data.user_id.is_login_first = this.isDisabled;
                this.router.navigate(['/sub_employer/offers/list']);
              }
            }
          }, (err) => {
            this.show_spinner = false;
            this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
          });
        },
        reject: () => {
          this.show_spinner = false;
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

  isTouched(value) {
    if (value) {
      this.istouchedArray.push(value);
    }
  }
  ngOnDestroy(): void {
    if (!this.isSubmit) {
      this.detail = this.form.value;
      // if () {
      if ((this.detail.oldpassword !== undefined && this.detail.oldpassword !== '') ||
        (this.detail.newpassword !== undefined && this.detail.newpassword !== '') ||
        (this.detail.confirmnewpassword !== undefined && this.detail.confirmnewpassword !== '')) {
        this.commonService.setuserData(this.detail);
        this.router.navigate([this.currentUrl]);
        this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
      }
      // else if (this.istouchedArray.length == 0) {
      //   this.commonService.setuserData('');
      // }
      // }
    }
  }
}





