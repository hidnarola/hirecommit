import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemeService } from 'ng2-charts';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-sub-account-add-view',
  templateUrl: './sub-account-add-view.component.html',
  styleUrls: ['./sub-account-add-view.component.scss']
})
export class SubAccountAddViewComponent implements OnInit {

  addAccount: FormGroup;
  submitted = false;
  admin_rights = false;
  id: any;
  panelTitle: string;
  is_Edit: boolean = false;
  is_View: boolean = false;
  detail: any = [];
  update_data_id: any;
  obj: any;
  show_spinner = false;
  cancel_link = '/employer/sub_accounts/list';

  constructor(
    private router: Router,
    private service: SubAccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.addAccount = new FormGroup({
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, this.noWhitespaceValidator, Validators.email]),
      admin_rights: new FormControl(false)
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    if (this.route.snapshot.data.title !== 'Add') {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
      });
      this.getDetail(this.id);
      if (this.route.snapshot.data.title === 'Edit') {
        this.is_Edit = true;
      } else {
        this.is_View = true;
      }
    } else {
      this.spinner.hide();
    }



  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }


  getDetail(id) {
    if (this.id) {
      this.panelTitle = 'Edit';

      this.service.view_sub_acc_detail(id).subscribe(res => {
        console.log('/', res['data']['user_id']['admin_rights']);

        if (res['data']['user_id']['admin_rights'] === 'no') {
          this.detail = {
            username: res['data']['username'],
            email: res['data']['user_id']['email'],
            admin_rights: false
          };
          this.detail
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


      });
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

  }

  onSubmit(flag: boolean) {
    this.submitted = true;
    if (this.id && flag) {
      console.log(this.detail['admin_rights']);
      if (this.detail['admin_rights'] === false) {
        this.obj = {
          username: this.detail['username'],
          email: this.detail['email'],
          admin_rights: 'no'
        };
        console.log('?', this.obj);
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
          this.show_spinner = true;
          this.service.edit_sub_account(this.update_data_id, this.obj).subscribe(res => {
            console.log('>?', this.obj);
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.router.navigate([this.cancel_link]);
          }, (err) => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        }
      });
    } else {
      if (flag) {
        this.show_spinner = true;
        console.log(this.addAccount.value['admin_rights']);

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
          }
        }
        else if (this.addAccount.value['admin_rights'] === undefined) {
          this.obj = {
            username: this.addAccount.value['username'],
            email: this.addAccount.value['email'],
            admin_rights: 'no'
          };
        }
        console.log(this.obj);
        this.service.add_sub_account(this.obj).subscribe(res => {
          if (res['data']['status'] === 1) {

            this.submitted = false;
            this.addAccount.reset();
            this.router.navigate([this.cancel_link]);
            this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
          }
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    }
  }

}
