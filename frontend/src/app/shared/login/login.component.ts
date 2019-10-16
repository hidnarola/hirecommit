import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-adminlayout',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  public isFormSubmited;
  public formData: any;
  constructor(public router: Router, private service: CommonService, public fb: FormBuilder) {
    this.formData = {};
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)]))
    });
  }

  onSubmit(valid) {
    // console.log(this.loginForm.controls['email'].errors['required']);

    this.isFormSubmited = true;
    if (valid) {
      this.service.login(this.loginForm.value).subscribe(res => {
        this.isFormSubmited = false;
        this.formData = {};
        // console.log(res['token']);
        const token = res['token'];
        localStorage.setItem('token', token);
        localStorage.setItem('user', res['role']);
        localStorage.setItem('userid', res['id']);
        if (res['role'] === 'admin') {
          this.router.navigate(['admin']);
        } else if (res['role'] === 'employer') {
          this.router.navigate(['employer']);
        } else if (res['role'] === 'candidate') {
          this.router.navigate(['candidate']);
        }
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

  ngOnInit() {

  }

}
