import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { ToastrService } from 'ngx-toastr';

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

  detail: any = [];
  update_data_id: any;
  obj: any;
  cancel_link = '/employer/sub_accounts/list';

  constructor(
    private router: Router,
    private service: SubAccountService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.addAccount = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      admin_rights: new FormControl(false)
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.getDetail(this.id);
  }

  getDetail(id) {
    if (this.id) {
      this.panelTitle = 'Edit';

      this.service.view_sub_acc_detail(id).subscribe(res => {
        if (res['data']['user_id']['admin_rights'] === 'no') {
          this.detail = {
            name: res['data']['username'],
            email: res['data']['user_id']['email'],
            admin_rights: false
          };
        } else if (res['data']['user_id']['admin_rights'] === 'yes') {
          this.detail = {
            name: res['data']['username'],
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
        name: null,
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
      if (this.detail['admin_rights'] === 'no') {
        this.obj = {
          name: this.detail['name'],
          email: this.detail['email'],
          admin_rights: false
        };
      } else if (this.detail['admin_rights'] === 'yes') {
        this.obj = {
          name: this.detail['name'],
          email: this.detail['email'],
          admin_rights: true
        };
      }
      console.log("obj==>", this.obj);

      this.service.edit_sub_account(this.update_data_id, this.obj).subscribe(res => {
        console.log('edited !!', res);
        this.submitted = false;
        this.router.navigate([this.cancel_link]);
        this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      if (flag) {
        if (this.addAccount.value['admin_rights'] === false) {
          this.obj = {
            name: this.addAccount.value['name'],
            email: this.addAccount.value['email'],
            admin_rights: 'no'
          };
        } else if (this.addAccount.value['admin_rights'] === true) {
          this.obj = {
            name: this.addAccount.value['name'],
            email: this.addAccount.value['email'],
            admin_rights: 'yes'
          };
        }
        this.service.add_sub_account(this.obj).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.addAccount.reset();
            this.router.navigate([this.cancel_link]);
            this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
          }
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    }
  }

}
