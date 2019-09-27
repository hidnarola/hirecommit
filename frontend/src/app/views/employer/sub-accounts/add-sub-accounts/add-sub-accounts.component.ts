import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { SubAccountService } from '../sub-accounts.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-sub-accounts',
  templateUrl: './add-sub-accounts.component.html',
  styleUrls: ['./add-sub-accounts.component.scss']
})
export class AddSubAccountsComponent implements OnInit {
  addAccount: FormGroup;
  submitted = false;
  public formData: any;
  public isFormSubmited;
  constructor(private router: Router, private service: SubAccountService) { }

  ngOnInit() {

    this.addAccount = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      adminrights: new FormControl(null)
    
    });
  }

  get f() {return  this.addAccount.controls;}

  onSubmit(valid) {
    console.log(this.addAccount);
    this.isFormSubmited = true;
    if (valid) {
      this.service.add_sub_account(this.addAccount.value).subscribe(res => {
        this.isFormSubmited = false;
        this.formData = {};
        if (res['status'] === 0) {
          console.log(res);
        } else if (res['data'].status === 1) {
          Swal.fire({
            type: 'success',
            text: res['message'],
          });
          this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
          // this.router.navigate(['/login']);
        } else {
          console.log(res);
        }
      });
    }
  
    this.addAccount.reset();
  
  }

  onClose() {
    this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }

}
