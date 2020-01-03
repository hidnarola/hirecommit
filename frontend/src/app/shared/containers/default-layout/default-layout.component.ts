import { Component, OnDestroy, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { admin, employer, candidate, sub_employer } from '../../_nav';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../../../views/employer/employer.service';
import { ModalOptions } from '../../modal_options';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';

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
  link: string;
  isProd: Boolean = false;
  isStaging: Boolean = false;
  isEmployer: Boolean = false;
  isCandidate: Boolean = false;
  isAdmin: Boolean = false;
  hostName: any = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private modalService: NgbModal,
    private empServise: EmployerService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
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

    if (this.userDetail.role === 'employer') {
      this.link = '/employer/offers/list';
    } else if (this.userDetail.role === 'sub-employer') {
      this.link = '/sub_employer/offers/list';
    } else if (this.userDetail.role === 'candidate') {
      this.link = '/candidate/offers/list';
    } else if (this.userDetail.role === 'admin') {
      this.link = '/admin/employers/approved_employer';
    }
    this.isProd = environment.production;
    this.isStaging = environment.staging;
  }

  ngOnInit() {
    const userType = localStorage.getItem('user');

    if (userType === 'admin') {
      this.navItems = admin;
      this.name = this.userDetail.email;
    } else {
      let profile;
      this.commonService.getChangedProfileDetail.subscribe((resp) => {
        this.commonService.profileData().then(res => {
          profile = res;
          this._profile_data = profile;
          if (userType === 'candidate') {
            if (this._profile_data[0].user_id.email_verified) {
              this.navItems = candidate;
              this.name = this._profile_data[0].firstname + ' ' + this._profile_data[0].lastname;
            } else {
              this.navItems = [];
              this.name = this._profile_data[0].firstname + ' ' + this._profile_data[0].lastname;
            }
          } else if (userType === 'employer') {
            this.navItems = employer;
            this.name = this._profile_data[0].username;
            // if (this._profile_data[0].user_id.is_email_change) {
            //   this.router.navigate(['/employer/change-password']);
            // }
            if (this._profile_data[0].user_id.is_login_first === false) {
              this.modalService.open(this.content, ModalOptions);
            }
          } else if (userType === 'sub-employer') {
            this.commonService.getFirstLogin.subscribe(response => {
              if (response === true) {
                this.navItems = sub_employer;
                this.name = this._profile_data[0].username;
              } else if (this._profile_data[0].user_id.is_login_first === false) {
                this.router.navigate(['sub_employer/change-password']);
                this.name = this._profile_data[0].username;
              } else {
                this.navItems = sub_employer;
                this.name = this._profile_data[0].username;
              }
            });
          }
        });
      });

    }
  }

  logouttoLanding() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userid');
    localStorage.clear();
    // this.toastr.info('Please Login Again', 'Session Expired!');
    if (this.isProd || this.isStaging) {
      if (this.userDetail.role === 'employer') {
        window.location.href = environment.employerURL;
      } else if (this.userDetail.role === 'sub-employer') {
        window.location.href = environment.employerURL;
      } else if (this.userDetail.role === 'candidate') {
        window.location.href = environment.candidateURL;
      } else if (this.userDetail.role === 'admin') {
        window.location.href = environment.mainURL + '/login';
      }

    } else {
      this.router.navigate(['/login']);
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

  setup(id) {
    this.obj = {
      'id': id
    };
    this.empServise.setup(this.obj).subscribe(res => {
      this._profile_data[0].user_id.is_login_first = true;
      this.commonService.setProfileDetail(this._profile_data);
      this.router.navigate(['/employer/locations/add']);
      document.getElementById('closeBtn').click();
      // this.activeModal.close();
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

}
