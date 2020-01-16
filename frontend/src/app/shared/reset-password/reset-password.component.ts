import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  submitform: FormGroup;
  params_token: any;
  public isFormSubmitted;
  public formData: any;
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  // tslint:disable-next-line: max-line-length

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: CommonService,
    private toastr: ToastrService,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.formData = {};
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
    this.form = this.fb.group({
      password: new FormControl('',
        Validators.compose([Validators.required,
        this.noWhitespaceValidator,
        Validators.minLength(8),
        Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      confirmpassword: new FormControl('',
        Validators.compose([Validators.required, this.noWhitespaceValidator, Validators.minLength(8)]))
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
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


  confirm(valid) {
    this.isFormSubmitted = true;

    if (valid) {
      this.submitform = new FormGroup({
        token: new FormControl(this.params_token.token),
        password: new FormControl(this.form.value.password)
      });
      const that = this;
      this.service.reset_password(this.submitform.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
          Swal.fire({
            type: 'success',
            text: 'Password has been reset successfully'

          }).then(function (isConf) {
            if (res['role'] === 'candidate') {
              window.location.href = environment.candidateURL + '/login';
            } else if (res['role'] === 'employer') {
              window.location.href = environment.employerURL + '/login';
            } else if (res['role'] === 'sub-employer') {
              window.location.href = environment.employerURL + '/login';
            } else {
              that.router.navigate(['/login']);
            }
            // if (res['role'] === 'candidate') {
            //   window.location.href = environment.candidateURL + '/login';
            // } else if (res['role'] === 'employer') {
            //   window.location.href = environment.employerURL + '/login';
            // } else if (res['role'] === 'sub-employer') {
            //   window.location.href = environment.employerURL + '/login';
            // }
            // else if (res['role'] === 'admin') {
            //   window.location.href = environment.mainURL + '/login';
            // } else {
            //   this.router.navigate(['/login']);
            // }
            // this.router.navigate(['/login']);
          });
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }
  }

  checkPasswords(g: FormGroup) { // here we have the 'passwords' group
    const password = g.get('password').value;
    const confirmpassword = g.get('confirmpassword').value;
    if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
      return password === confirmpassword ? null : g.get('confirmpassword').setErrors({ 'mismatch': true });
    }
  }

}
