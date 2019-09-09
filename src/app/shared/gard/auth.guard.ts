import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let islogin = false;
    let loginUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    console.log(loginUser, token);

    try {
      loginUser = loginUser;
      if (loginUser && token) {
        islogin = true;
      } else {
        islogin = false;
      }
    } catch (e) {
      islogin = false;
    }
    if (!islogin) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

}
