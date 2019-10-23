import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-adminlayout',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public isFormSubmitted;
  public formData: any;

  constructor(
    public router: Router,
    private service: CommonService,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

  ngOnInit() { }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.service.login(this.loginForm.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        const token = res['token'];
        localStorage.setItem('token', token);
        localStorage.setItem('user', res['role']);
        localStorage.setItem('userid', res['id']);
        console.log(' log res => ', res);
        const userData = { ...res[`data`], ...res[`userDetails`][0].userDetail };
        this.service.setProfileDetail(userData);
        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        if (res['role'] === 'admin') {
          this.router.navigate(['admin']);
        } else if (res['role'] === 'employer') {
          this.router.navigate(['employer']);
        } else if (res['role'] === 'candidate') {
          this.router.navigate(['candidate']);
        }
      }, (err) => {
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
