import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { sub_employer } from '../_nav';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let islogin = false;
    let loginUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    try {
      // loginUser = JSON.parse(loginUser);
      loginUser = loginUser;
      if (loginUser && token) {
        islogin = true;
      } else {
        islogin = false;
      }
    } catch (e) {
      islogin = false;
    }
    if (islogin) {
      if (loginUser !== 'sub-employer') {
        this.router.navigate([loginUser]);
      } else {
        this.router.navigate(['sub_employer']);
      }
      return false;
    }
    return true;
  }
}
