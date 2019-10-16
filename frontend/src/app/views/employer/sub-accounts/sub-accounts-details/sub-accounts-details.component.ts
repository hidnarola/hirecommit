import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-accounts-details',
  templateUrl: './sub-accounts-details.component.html',
  styleUrls: ['./sub-accounts-details.component.scss']
})
export class SubAccountsDetailsComponent implements OnInit {

  cancel_link = '/employer/sub_accounts/list';

  constructor(private router: Router) {
    console.log('employer - sub accounts : sub-accounts-details component => ');
  }

  ngOnInit() { }

  edit() {
    this.router.navigate(['/employer/sub_accounts/add']);
  }

}
