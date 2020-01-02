import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, ) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data.expectedRole;
    console.log('expectedRole=>', expectedRole);
    const token = localStorage.getItem('token');
    console.log('token=>', token);
    const tokenPayload = jwt_decode(token);

    console.log('expectedRole=>', expectedRole);
    if (token) {
      // decode the token to get its payload

      // if (
      //   !this.auth.isAuthenticated() ||
      //   tokenPayload.role !== expectedRole
      // ) {
      //   this.router.navigate(['/login']);
      //   return false;
      // }
      return true;
    } else if (!token || (tokenPayload.role !== expectedRole)) {

      if (expectedRole) {

      }
      this.router.navigate(['/login']);
      return false;
    }
    // if (!this.auth.isAuthenticated()) {
    //   this.router.navigate(['/login']);
    //   return false;
    // }
    // return true;
  }
}
