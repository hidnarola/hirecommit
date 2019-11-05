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
      'oldpassword': new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)])),
      'newpassword': new FormControl('', Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)])),
      'confirmnewpassword': new FormControl('', [Validators.required, this.noWhitespaceValidator])
    }, { validator: this.checkPasswords });

    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  send() {
    this.router.navigate(['/employer/offers/list']);
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
              }
              else if (this.userDetail.role === 'candidate') {
                this.router.navigate(['/candidate/offers/list']);
              }
              else if (this.userDetail.role === 'admin') {
                this.router.navigate(['/admin/employers/approved_employer']);
              }
              else if (this.userDetail.role === 'sub-employer') {
                this.router.navigate(['/sub_employer/offers/list']);
              }
            }
          }, (err) => {
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
