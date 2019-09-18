import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { admin, employer, candidate } from '../../_nav';
import { Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = [];
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  ViewProfile() {
    this.router.navigate(['/profile']);
  }

  ngOnInit() {
    const userType = localStorage.getItem('user');
    if (userType === 'admin') {
      this.navItems = admin;
    } else if (userType === 'employer') {
      this.navItems = employer;
    } else if (userType === 'candidate') {
      this.navItems = candidate;
    }
  }

}
