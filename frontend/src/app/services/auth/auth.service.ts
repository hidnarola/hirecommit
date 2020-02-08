import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { environment } from '../../../environments/environment';
@Injectable()
export class AuthService {
  isProd: Boolean = false;
  isStaging: Boolean = false;
  constructor(public jwtHelper: JwtHelperService, public router: Router, private activatedRoute: ActivatedRoute) {
    this.isProd = environment.production;
    this.isStaging = environment.staging;
    // const url: string = state.url;
  }
  // ...
  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      // if (this.isProd) {
      //   if (this.userDetail.role === 'employer') {
      //     window.location.href = 'http://employer.hirecommit.com/';
      //   } else if (this.userDetail.role === 'sub-employer') {
      //     window.location.href = 'http://employer.hirecommit.com/';
      //   } else if (this.userDetail.role === 'candidate') {
      //     window.location.href = 'http://candidate.hirecommit.com/';
      //   } else if (this.userDetail.role === 'admin') {
      //     window.location.href = 'http://hirecommit.com/login';
      //   }
      // } else {
      //   this.route.navigate(['/login']);
      // }
      // this.router.navigate(['/login']);
      return false;
    } else {
      return !this.jwtHelper.isTokenExpired(token);
    }
    // Check whether the token is expired and return
    // true or false
    // return !this.jwtHelper.isTokenExpired(token);
  }
}
