import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { AuthService } from './auth.service';
import jwt_decode from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { CommonService } from '../common.service';
import { ConfirmationService } from 'primeng/api';
import { Location } from '@angular/common';
@Injectable()
export class RoleGuardService implements CanActivate {

  isProd: Boolean = false;
  isStaging: Boolean = false;
  status = true;
  fromPopup = false;
  redirect = false;
  constructor(
    public auth: AuthService,
    public router: Router,
    private service: CommonService,
    private confirmationService: ConfirmationService,
    private location: Location
  ) {

    this.isProd = environment.production;
    this.isStaging = environment.staging;
    this.service.getunSavedData.subscribe(res => {
      this.fromPopup = true;

      if (res) {
        console.log('in response=======>', res);

        if (this.redirect) {
          this.router.navigate([res.newurl]);
        }

        if (!this.redirect) {
          this.confirmationService.confirm({
            message: 'Are you sure you want to leave this page?',
            accept: () => {

              this.removeData();
              this.redirect = true;
              // if ((res.url === '/employer/change-password' || res.newurl === '/employer/change-password') ||
              //   (res.url === '/employer/profile' || res.newurl === '/employer/profile') ||
              //   (res.url === '/sub-employer/change-password' || res.newurl === '/sub-employer/change-password')) {

              //   this.router.navigate([res.newurl]);
              // } else {

              this.router.navigate([res.newurl]);
              // }
              // this.router.navigate([res.newurl]);
            }, reject: () => {
              this.redirect = false;
              this.router.navigate([res.url]);
            }
          });
        }

      } else if (!res) {
        console.log('out of response=======>');

      }
      this.redirect = false;
    });
  }

  removeData() {

    this.service.setuserData('');
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


    // if (this.fromPopup) {
    //   return this.status;
    // } else
    if (!token || (tokenPayload.role !== expectedRole)) {

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
      return true;
    }

  }
}
