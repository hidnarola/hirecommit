import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemeService } from 'ng2-charts';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { CommonService } from '../../../../services/common.service';
import { EmployerService } from '../../../admin/employers/employer.service';
import { Location } from '@angular/common';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-sub-account-add-view',
  templateUrl: './sub-account-add-view.component.html',
  styleUrls: ['./sub-account-add-view.component.scss']
})
export class SubAccountAddViewComponent implements OnInit {
  istouchedArray = [];
  addAccount: FormGroup;
  submitted = false;
  admin_rights = false;
  isSubmit = false;
  sub_account: any;
  id: any;
  panelTitle: string;
  is_Edit: boolean = false;
  is_View: boolean = false;
  detail: any = [];
  update_data_id: any;
  obj: any;
  userDetail: any;

  show_spinner = false;
  employerID: any;
  currentUrl = '';
  cancel_link = '/employer/sub_accounts/list';
  // cancel_link1 = '/admin/employers/approved_employer/'+ this.employerID +'/sub_accounts/list';
  constructor(
    private router: Router,
    private service: SubAccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService,
    private employerService: EmployerService,
    private location: Location
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    this.employerID = this.route.snapshot.params['eid'];
    this.currentUrl = this.router.url;
  }
  isTouched(value) {
    if (value) {
      this.istouchedArray.push(value);
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.commonService.getuserdata.subscribe(res => {
      this.formInit();
      this.getDetail(this.id).then((resp: any) => {
        if (res !== '') {
          if (this.is_Edit) {
            this.detail = { ...resp, ...res };
          } else {
            this.detail = { ...res };
          }
        } else if (resp !== '' && (res._id == '' || res.username == '' || res.admin_rights == false || res.email == '')) {
          this.detail = { ...resp };
        }
        else if (!res && !resp) {
          // this.formInit();
          this.detail = '';
        }
      });
    });
    // this.formInit();



    if (this.route.snapshot.data.title === 'Add') {
      this.panelTitle = 'Add';
      this.detail = '';
    };

    if (this.route.snapshot.data.title !== 'Add') {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
      });
      // this.getDetail(this.id);
      if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
        if (this.route.snapshot.data.title === 'Edit') {
          this.is_Edit = true;
        } else {
          this.is_View = true;
        }
      } else if (this.userDetail.role === 'admin') {
        if (this.route.snapshot.data.title === 'Sub - Account Edit') {
          this.is_Edit = true;
        } else {
          this.is_View = true;
          this.getDetail(this.id);
        }
      }
    } else {
      this.spinner.hide();
    }
  }

  formInit = () => {
    this.addAccount = new FormGroup({
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      admin_rights: new FormControl(false)
    });
  }
  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  async getDetail(id: string) {
    if (this.id) {
      if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
        id = this.id;
        this.panelTitle = 'Edit';
        return new Promise((pass, fail) => {
          this.service.view_sub_acc_detail(id).subscribe(res => {
            if (res['data']['user_id']['admin_rights'] === 'no') {
              this.detail = {
                username: res['data']['username'],
                email: res['data']['user_id']['email'],
                admin_rights: false
              };
            } else if (res['data']['user_id']['admin_rights'] === 'yes') {
              this.detail = {
                username: res['data']['username'],
                email: res['data']['user_id']['email'],
                admin_rights: true
              };
            }
            // this.detail = {
            //   name: res['data']['username'],
            //   email: res['data']['user_id']['email'],
            //   admin_rights: res['data']['user_id']['admin_rights']
            // };
            this.update_data_id = res['data']['user_id']['_id'];
            pass(this.detail);
          }, (err) => {
            fail(err);
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        });
      } else if (this.id && this.userDetail.role === 'admin') {
        // this.panelTitle = 'Edit';
        return new Promise((pass, fail) => {
          this.employerService.get_details_sub_employer(id).subscribe(res => {
            if (res['data']['user_id']['admin_rights'] === 'no') {
              this.detail = {
                username: res['data']['username'],
                email: res['data']['user_id']['email'],
                admin_rights: false
              };
            } else if (res['data']['user_id']['admin_rights'] === 'yes') {
              this.detail = {
                username: res['data']['username'],
                email: res['data']['user_id']['email'],
                admin_rights: true
              };
            }
            // this.detail = {
            //   name: res['data']['username'],
            //   email: res['data']['user_id']['email'],
            //   admin_rights: res['data']['user_id']['admin_rights']
            // };
            this.update_data_id = res['data']['user_id']['_id'];
            pass(this.detail);
          }, (err) => {
            fail(err);
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        });
      }
    } else {
      this.detail = {
        _id: null,
        username: null,
        email: null,
        admin_rights: false
      };
      this.panelTitle = 'Add';

      this.addAccount.reset();
    }
  }

  get f() { return this.addAccount.controls; }

  checkValue(e) {
    this.isTouched(e);
  }

  onSubmit(flag: boolean) {
    this.isSubmit = true;

    this.submitted = true;
    this.show_spinner = true;
    if (this.id && flag && (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer')) {
      if (this.detail['admin_rights'] === false) {
        this.obj = {
          username: this.detail['username'],
          email: this.detail['email'],
          admin_rights: 'no'
        };
      } else if (this.detail['admin_rights'] === true) {
        this.obj = {
          username: this.detail['username'],
          email: this.detail['email'],
          admin_rights: 'yes'
        };
      }
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Update this record?',
        accept: () => {
          this.service.edit_sub_account(this.update_data_id, this.obj).subscribe(res => {
            this.submitted = false;
            this.commonService.setuserData('');
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate(['/sub_employer/sub_accounts/list']);
            } else if (this.userDetail.role === 'admin') {
              this.router.navigate(['/admin/employers/approved_employer/' + this.employerID + '/sub_accounts/list']);
            }
          }, (err) => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        }, reject: () => {
          this.show_spinner = false;
        }
      });
    } else if (this.id && flag && this.userDetail.role === 'admin') {
      this.show_spinner = true;
      if (this.detail['admin_rights'] === false) {
        this.obj = {
          username: this.detail['username'],
          email: this.detail['email'],
          admin_rights: 'no'
        };
      } else if (this.detail['admin_rights'] === true) {
        this.obj = {
          username: this.detail['username'],
          email: this.detail['email'],
          admin_rights: 'yes'
        };
      }
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Update this record?',
        accept: () => {

          this.employerService.edit_sub_employer(this.update_data_id, this.obj).subscribe(res => {
            this.submitted = false;
            this.commonService.setuserData('');
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });


            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate(['/sub_employer/sub_accounts/list']);
            } else if (this.userDetail.role === 'admin') {
              this.router.navigate(['/admin/employers/approved_employer/' + this.employerID + '/sub_accounts/list']);
            }
          }, (err) => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        }, reject: () => {
          this.show_spinner = false;
        }
      });
    } else {
      if (flag) {
        this.show_spinner = true;
        if (this.addAccount.value['admin_rights'] === false) {
          this.obj = {
            username: this.addAccount.value['username'],
            email: this.addAccount.value['email'],
            admin_rights: 'no'
          };
        } else if (this.addAccount.value['admin_rights'] === true) {
          this.obj = {
            username: this.addAccount.value['username'],
            email: this.addAccount.value['email'],
            admin_rights: 'yes'
          };
        } else if (this.addAccount.value['admin_rights'] === undefined) {
          this.obj = {
            username: this.addAccount.value['username'],
            email: this.addAccount.value['email'],
            admin_rights: 'no'
          };
        }
        this.service.add_sub_account(this.obj).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.commonService.setuserData('');
            this.submitted = false;
            this.addAccount.reset();
            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate(['/sub_employer/sub_accounts/list']);
            } else if (this.userDetail.role === 'admin') {
              this.router.navigate(['/admin/employers/approved_employer/' + this.employerID + '/sub_accounts/list']);
            }
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          }
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
      else {
        this.show_spinner = false;
      }
    }
  }
  checkEmail() {
    this.commonService.email_exists({ 'email': this.addAccount.value.email, 'user_id': this.update_data_id }).subscribe(res => {
    }, (err) => {
      this.addAccount.controls['email'].setErrors({ 'isExist': true });
      this.addAccount.updateValueAndValidity();
    });

  }

  Cancel() {
    this.isSubmit = true;
    this.commonService.setuserData('');
    if (this.userDetail.role === 'employer') {
      this.router.navigate([this.cancel_link]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['/sub_employer/sub_accounts/list']);
    } else if (this.userDetail.role === 'admin') {
      this.router.navigate(['/admin/employers/approved_employer/' + this.employerID + '/sub_accounts/list']);
    }
  }

  ngOnDestroy(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer' || this.userDetail.role === 'admin') {
      if (!this.is_View && !this.isSubmit) {
        this.detail = this.addAccount.value;
        if (this.is_Edit) {
          if (this.istouchedArray.length > 0) {
            if (this.detail.username || this.detail.email || this.detail.admin_rights !== false) {
              this.commonService.setuserData(this.detail);
              this.router.navigate([this.currentUrl]);
              this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
            }
          } else if (this.istouchedArray.length == 0) {
            this.commonService.setuserData('');
          }
        } else {
          if (this.detail.username || this.detail.email || this.detail.admin_rights !== false) {
            this.commonService.setuserData(this.detail);
            this.router.navigate([this.currentUrl]);
            this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });
          }
        }

      }
    }

  }

}
