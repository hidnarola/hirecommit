import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, NavigationEnd, NavigationStart } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { CommonService } from '../common.service';
import { ConfirmationService } from 'primeng/api';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(
    public auth: AuthService,
    public router: Router,
    private service: CommonService,
    private confirmationService: ConfirmationService
  ) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    const tokenPayload = jwt_decode(token);
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
  CheckNav() {

  }


  //  this.service.getunSavedData.subscribe(res => {
  //    if (res) {
  //      console.log('popup=======>', res);
  //      this.service.value_popup(false);
  //    } else {
  //      console.log('no popup=======>', res);
  //      this.service.value_popup(true);
  //    }
  //  });

}
