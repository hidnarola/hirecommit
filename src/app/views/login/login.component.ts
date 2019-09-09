import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(public router: Router) {}

  onSubmit() {
      // console.log('hiii', this.loginForm.value.email)
      if (this.loginForm.value.email){
        localStorage.setItem('user', this.loginForm.value.email);
        localStorage.setItem('token', 'abc123456');
        this.router.navigate(['/']);
      }
  }

  signup() {
    this.router.navigate(['/register']);
  }

  signup1() {
    this.router.navigate(['/candidateregister']);
  }

  Onclick() {
    this.router.navigate(['/forgotpassword']);
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null),
      password: new FormControl(null)
    });
  }

 }
