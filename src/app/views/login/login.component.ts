import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {

  constructor(public router: Router) {}

  login() {
      localStorage.setItem('admin', 'admin');
      localStorage.setItem('token', 'abc123456');
      this.router.navigate(['/employer/view']);
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

 }
