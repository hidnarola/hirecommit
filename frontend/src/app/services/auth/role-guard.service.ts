import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
@Injectable()
export class RoleGuardService implements CanActivate {

  isProd: Boolean = false;
  constructor(public auth: AuthService, public router: Router) {
    this.isProd = environment.production;
  }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    const tokenPayload = jwt_decode(token);
    // if (token) {
    //   // decode the token to get its payload
    //   const tokenPayload = jwt_decode(token);
    //   // console.log('decoded value of token', tokenPayload);
    //   if (
    //     !this.auth.isAuthenticated() ||
    //     tokenPayload.role !== expectedRole
    //   ) {
    //     this.router.navigate(['/login']);
    //     return false;
    //   }
    //   return true;
    // } else {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    console.log('expectedRole=================>', expectedRole);
    if (!token || (tokenPayload.role !== expectedRole)) {
      if (expectedRole) {
        if (this.isProd) {
          if (expectedRole === 'employer') {
            window.location.href = 'http://employer.hirecommit.com/';
          } else if (expectedRole === 'sub-employer') {
            window.location.href = 'http://employer.hirecommit.com/';
          } else if (expectedRole === 'candidate') {
            window.location.href = 'http://candidate.hirecommit.com/';
          } else if (expectedRole === 'admin') {
            window.location.href = 'http://hirecommit.com/login';
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    } else {
      return true;
    }


  }
}
