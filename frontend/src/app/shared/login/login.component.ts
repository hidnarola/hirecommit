import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-adminlayout',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public router: Router, private service: CommonService) {}

  onSubmit() {
      // console.log('hiii', this.loginForm.value);
      if (this.loginForm.value.email && this.loginForm.value.password) {
        this.service.login(this.loginForm.value).subscribe(res => {
          console.log(res);
          console.log(res['data'].role);

          const token = res['token'];
          localStorage.setItem('token', token);
          localStorage.setItem('user', res['data'].role);
          if (res['data'].role === 'admin') {
            this.router.navigate(['admin']);
          } else if (res['data'].role === 'employer') {
            this.router.navigate(['employer']);
          } else if (res['data'].role === 'candidate') {
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
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null)
    });
  }

 }
