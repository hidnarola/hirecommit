import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(private router: Router, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  changepassword() {
    this.router.navigate(['/changepassword']);
  }

  logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  ViewProfile(){
     this.router.navigate(['/profile']);
  }

  ngOnInit() {
  //   const app = [];
  //   console.log("$$$$$$$$$", this.navItems);
  //   const user =  localStorage.getItem('admin');
  //  if (user != null && user !== '' && user != undefined) {
  //    if(user == 'admin') {
  //      for (let index = 0; index < this.navItems.length; index++) {
  //        if (index <= 1  )
  //        {
  //          app.push(this.navItems[index]);
  //        } 
  //      }
  //      this.navItems = app;
  //    }
  //  }
    
  }

}
