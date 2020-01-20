import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common.service';
@Injectable()
export class RoleGuardService implements CanActivate {

  isProd: Boolean = false;
  isStaging: Boolean = false;
  status = true;
  constructor(public auth: AuthService, public router: Router, private service: CommonService, ) {
    this.isProd = environment.production;
    this.isStaging = environment.staging;
    this.service.getunSavedData.subscribe(res => {
      console.log('res for form= ======== ======== ====== ======>', res);

      if (res) {
        this.service.value_popup(true);
        this.status = true;
        console.log('1=======>', this.status);
      } else {
        this.status = false;
        console.log('2=======>', this.status);
      }
      if (res) {
        console.log('popup=======>', res);
        this.service.value_popup(false);
      } else {
        console.log('no popup=======>', res);
        this.service.value_popup(true);
      }
    });
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
    if (!token || (tokenPayload.role !== expectedRole)) {
      console.log('false=======>');

      if (expectedRole) {
        if (this.isProd || this.isStaging) {
          if (expectedRole === 'employer') {
            window.location.href = environment.employerURL;
          } else if (expectedRole === 'sub-employer') {
            window.location.href = environment.employerURL;
          } else if (expectedRole === 'candidate') {
            window.location.href = environment.candidateURL;
          } else if (expectedRole === 'admin') {
            window.location.href = environment.mainURL + '/login';
          }
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    } else {
      console.log('this.status=== check here ====>', this.status);

      // return this.status;
      return true;

    }


  }
}
