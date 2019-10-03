import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  admin_rights = false;
  constructor(private router: Router, private service: SubAccountService) { }

  ngOnInit() {
    this.addAccount = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      admin_rights: new FormControl('')
    });
  }

  get f() {return  this.addAccount.controls; }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    if (flag) {
      this.service.add_sub_account(this.addAccount.value).subscribe(res => {
        console.log(res);

        if (res['status'] === 1) {
          console.log(res);
        }
      }, (err) => {
        console.log(err);
      });
      this.addAccount.reset();
      this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
    }
  }

  checkValue(e) {
    this.admin_rights = e.target.checked;
  }

  onClose() {
    this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }

}
