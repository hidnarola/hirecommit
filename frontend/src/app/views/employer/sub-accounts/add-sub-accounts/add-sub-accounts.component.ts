import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { SubAccountService } from '../sub-accounts.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-sub-accounts',
  templateUrl: './add-sub-accounts.component.html',
  styleUrls: ['./add-sub-accounts.component.scss']
})
export class AddSubAccountsComponent implements OnInit {
  addAccount: FormGroup;
  submitted = false;
  admin_rights = false;
  id: any;
  panelTitle: string;
  buttonTitle: string;
  detail: any = [];
  update_data_id: any;
  constructor(private router: Router, private service: SubAccountService, private route: ActivatedRoute, private toastr: ToastrService) { }

  ngOnInit() {
    this.addAccount = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      admin_rights: new FormControl(false)
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log(this.id);
    });
    this.getDetail(this.id);
  }


  getDetail(id) {
    if (this.id) {
      this.panelTitle = 'Edit';
      this.buttonTitle = 'Update';
      console.log('hiiiiiiiiiii', id);

      this.service.view_sub_acc_detail(id).subscribe(res => {
        console.log('res', res['data']);
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

  onSubmit(flag: boolean) {
    this.submitted = true;
    if (this.id && flag) {
      // console.log('console detail : this.detail ==> ', this.detail); return false;
      //  const res_data = {
      //  'id': this.id,
      //  'country': this.detail.country,
      //  'city': this.detail.city
      // };
      // console.log(this.detail); return false;
      this.service.edit_sub_account(this.update_data_id, this.detail).subscribe(res => {
        console.log('edited !!', res);
        this.submitted = false;
        this.router.navigate(['/employer/sub_accounts/view_subaccount']);
        this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      if (flag) {
        // console.log(this.addAccount.value); return false;
        this.service.add_sub_account(this.addAccount.value).subscribe(res => {
          if (res['data']['status'] === 1) {
            console.log(res);
            this.submitted = false;
            this.addAccount.reset();
            this.router.navigate(['/employer/sub_accounts/view_subaccount']);
            this.toastr.success(res['data']['message'], 'Success!', { timeOut: 3000 });
          }
        }, (err) => {
          console.log(err);
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    }

  }

  checkValue(e) {
    this.admin_rights = e.target.checked;
  }

  onClose() {
    this.router.navigate(['/employer/subaccounts/list']);
  }

}
