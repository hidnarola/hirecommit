import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { SubAccountService } from '../sub-accounts.service';

@Component({
  selector: 'app-add-sub-accounts',
  templateUrl: './add-sub-accounts.component.html',
  styleUrls: ['./add-sub-accounts.component.scss']
})
export class AddSubAccountsComponent implements OnInit {
  addAccount: FormGroup;
  submitted = false;
  adminrights = false;
  id: any;
  panelTitle: string;
  buttonTitle: string;
  detail: any = [];
  constructor(private router: Router, private service: SubAccountService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.addAccount = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      adminrights: new FormControl('')
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

      this.service.view_sub_acc_detail(id).subscribe(res => {
        console.log('res', res);
        this.detail = res['data']['data'];
        console.log('subscribed!', this.detail);
      });

    } else {
      this.detail = {
        _id: null,
        name: null,
        email: null,
        adminrights: null
      };
      this.panelTitle = 'Add';
      this.buttonTitle = 'Add';
      this.addAccount.reset();
    }
  }

  get f() { return this.addAccount.controls; }

  onSubmit(flag: boolean) {
    this.submitted = true;
    if (flag) {
      this.service.add_sub_account(this.addAccount.value).subscribe(res => {
        if (res['data']['status'] === 1) {
          console.log(res);
          this.addAccount.reset();
          this.router.navigate(['/employer/subaccounts/list']);
        }
      }, (err) => {
        console.log(err);
      });
    }
  }

  checkValue(e) {
    this.adminrights = e.target.checked;
  }

  onClose() {
    this.router.navigate(['/employer/subaccounts/list']);
  }

}
