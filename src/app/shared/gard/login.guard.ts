import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

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
      this.router.navigate(['/employer/view']);
      return false;
    }
    return true;
  }
}
