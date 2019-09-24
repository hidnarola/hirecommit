import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  submitform: FormGroup;
  params_token: any;
  public isFormSubmited;
  public formData: any;
  // tslint:disable-next-line: max-line-length
  constructor(private activatedRoute: ActivatedRoute, private service: CommonService, private toastr: ToastrService, private router: Router, public fb: FormBuilder) {
    this.formData = {};
    this.form = this.fb.group({
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmpassword: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
    });
  }

  confirm (valid) {
    this.isFormSubmited = true;
    if (valid) {
      this.submitform = new FormGroup({
        token: new FormControl(this.params_token.token),
        password: new FormControl(this.form.value.password)
      });
      this.service.reset_password(this.submitform.value).subscribe(res => {
        this.isFormSubmited = false;
        this.formData = {};
        if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Error!', {timeOut: 3000});
          this.router.navigate(['/login']);
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
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
