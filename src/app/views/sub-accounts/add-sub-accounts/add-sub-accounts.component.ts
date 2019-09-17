import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { group } from '@angular/animations';

@Component({
  selector: 'app-add-sub-accounts',
  templateUrl: './add-sub-accounts.component.html',
  styleUrls: ['./add-sub-accounts.component.scss']
})
export class AddSubAccountsComponent implements OnInit {
  addAccount: FormGroup;
  submitted = false;
  constructor(private router: Router) { }

  ngOnInit() {

    this.addAccount = new FormGroup({
      name: new FormControl(null,[Validators.required]),
      email: new FormControl(null,[Validators.required, Validators.email]),
      desig: new FormControl(null,[Validators.required]),
      ecode: new FormControl(null,[Validators.required])
    })
  }

  get f() {return  this.addAccount.controls}

  onSubmit(flag: boolean){
    this.submitted = !flag;
    console.log(this.addAccount.value);

  if (flag) {
    this.addAccount.reset();
    this.router.navigate(['/subaccounts/viewsubaccount']);
   
  }
  }

  onClose(){
    this.router.navigate(['/subaccounts/viewsubaccount']);
  }

}
