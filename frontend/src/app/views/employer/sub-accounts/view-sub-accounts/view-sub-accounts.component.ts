import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubAccountService } from '../sub-accounts.service';

@Component({
  selector: 'app-view-sub-accounts',
  templateUrl: './view-sub-accounts.component.html',
  styleUrls: ['./view-sub-accounts.component.scss']
})
export class ViewSubAccountsComponent implements OnInit {
sub_accounts: any;
  constructor(private router: Router, private service: SubAccountService) { }
  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

    this.service.view_sub_account().subscribe(res => {
      console.log(res);
      this.sub_accounts = res[('data')];
      
    })

  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    // do next particular records like  101 - 200 rows.
    // we are calling to api

    console.log('next clicked');
  }
  previousButtonClickEvent(): void {
    // do previous particular the records like  0 - 100 rows.
    // we are calling to API
  }
  detail() {
    this.router.navigate(['/employer/manage_subaccount/sub_accountdetail']);
   }

   edit() {
    this.router.navigate(['/employer/manage_subaccount/add_subaccounts']);
   }

   delete() {}

   onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
   }
}
