import { Component, OnDestroy, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { admin, employer, candidate, sub_employer } from '../../_nav';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../../../views/employer/employer.service';
import { ModalOptions } from '../../modal_options';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  providers: [NgbModal]
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content: ElementRef;
  public navItems = [];
  name: any;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  currentYear = new Date().getFullYear();
  userDetail;
  obj: any;
  _profile_data: any = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private modalService: NgbModal,
    private empServise: EmployerService,
    // public activeModal: NgbActiveModal,
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

  ngOnInit() {
    const userType = localStorage.getItem('user');

    if (userType === 'admin') {
      this.navItems = admin;
      this.name = this.userDetail.email;
    } else {

      let profile;
      this.commonService.profileData().then(res => {
        profile = res;

        this._profile_data = profile;

        if (userType === 'employer') {

          this.navItems = employer;
          this.name = this._profile_data[0].username;

          if (this._profile_data[0].user_id.is_login_first === false) {
            // options for modal
            this.modalService.open(this.content, ModalOptions);
          }

        } else if (userType === 'sub-employer') {

          this.commonService.getFirstLogin.subscribe(res => {
            if (res) {
              this._profile_data[0].user_id.is_login_first = res;
            }
            if (this._profile_data[0].user_id.is_login_first === false) {
              this.router.navigate(['sub_employer/change-password']);
              this.name = this._profile_data[0].username;
            } else if (this._profile_data[0].user_id.is_login_first === true) {
              this.navItems = sub_employer;
              this.name = this._profile_data[0].username;
            }
          });
        } else if (userType === 'candidate') {
          if (this._profile_data[0].user_id.email_verified) {
            this.navItems = candidate;
            this.name = this._profile_data[0].firstname + ' ' + this._profile_data[0].lastname;
          } else {
            this.navItems = [];
            this.name = this._profile_data[0].firstname + ' ' + this._profile_data[0].lastname;
          }
        }
      });
    }
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
    if (this.userDetail.role === 'employer') {
      this.router.navigate(['employer/profile']);
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['candidate/profile']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userid');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  setup(id) {
    console.log('id=>', id);
    this.obj = {
      'id': id
    };
    this.empServise.setup(this.obj).subscribe(res => {
      console.log('res=>is_login_first', this._profile_data);
      this._profile_data[0].user_id.is_login_first = true;
      this.commonService.setProfileDetail(this._profile_data);
      this.router.navigate(['/employer/locations/add']);
      document.getElementById('closeBtn').click();
      // this.activeModal.close();
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

}
