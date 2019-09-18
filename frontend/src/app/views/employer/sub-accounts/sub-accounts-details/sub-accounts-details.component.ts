import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-accounts-details',
  templateUrl: './sub-accounts-details.component.html',
  styleUrls: ['./sub-accounts-details.component.scss']
})
export class SubAccountsDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onClose() {
   this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }
  edit() {
    this.router.navigate(['/employer/manage_subaccount/add_subaccounts']);
  }

  cancel() {
    this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }

}
