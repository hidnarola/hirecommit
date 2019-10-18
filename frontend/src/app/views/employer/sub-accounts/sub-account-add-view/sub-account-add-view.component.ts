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
  buttonTitle: string;
  detail: any = [];
  update_data_id: any;
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
      this.buttonTitle = 'Update';
      this.service.view_sub_acc_detail(id).subscribe(res => {
        this.detail = {
          name: res['data']['username'],
          email: res['data']['user_id']['email'],
          admin_rights: res['data']['user_id']['admin_rights']
        };
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
      this.buttonTitle = 'Add';
      this.addAccount.reset();
    }
  }

  get f() { return this.addAccount.controls; }

  checkValue(e) {
    this.admin_rights = e.target.checked;
  }

  onSubmit(flag: boolean) {
    this.submitted = true;
    if (this.id && flag) {

      this.service.edit_sub_account(this.update_data_id, this.detail).subscribe(res => {
        this.submitted = false;
        this.router.navigate([this.cancel_link]);
        this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      if (flag) {
        this.service.add_sub_account(this.addAccount.value).subscribe(res => {
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
