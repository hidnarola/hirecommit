import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { admin, employer, candidate, sub_employer } from '../../_nav';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  currentYear = new Date().getFullYear();
  userDetail;
  _profile_data: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    @Inject(DOCUMENT) _document?: any,
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  changepassword() {
    // console.log(this.userDetail.role);
    if (this.userDetail.role === 'admin') {
      this.router.navigate(['admin/change-password']);
    } else if (this.userDetail.role === 'employer') {
      this.router.navigate(['employer/change-password']);
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['candidate/change-password']);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['sub_employer/change-password']);
    }
  }
  profile() {
    // console.log(this.userDetail.role);
    // if (this.userDetail.role === 'admin') {
    //   this.router.navigate(['admin/profile']);
    // } else
    if (this.userDetail.role === 'employer') {
      this.router.navigate(['employer/profile']);
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['candidate/profile']);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['sub_employer/profile']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userid');
    localStorage.clear();
    // localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  ViewProfile() {
    this.router.navigate(['employer/profile']);
  }

  customFeild() {
    this.router.navigate(['employer/customfeild/list']);
  }

  ngOnInit() {
    const userType = localStorage.getItem('user');
    console.log('userType *********************=================> ', userType, this.userDetail);
    if (this.userDetail.role !== 'admin') {
      this.commonService.getDecryptedProfileDetail().then(res => {
        this._profile_data = res;
        console.log('profile ////////////////////////////=> ', this._profile_data);
      });
    }

    if (userType === 'admin') {
      this.navItems = admin;
    } else if (userType === 'employer') {
      this.navItems = employer;
    } else if (userType === 'candidate') {
      if (this._profile_data && this._profile_data.email_verified) {
        this.navItems = candidate;
      } else {
        this.navItems = [];
      }
    } else if (userType === 'sub-employer') {
      this.navItems = sub_employer;
    }
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

}
