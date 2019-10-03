import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-view-sub-accounts',
  templateUrl: './view-sub-accounts.component.html',
  styleUrls: ['./view-sub-accounts.component.scss']
})
export class ViewSubAccountsComponent implements OnDestroy, OnInit, AfterViewInit {
  // @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  sub_accounts: any = [];
  data: any[];
  admin_rights = true;
  dtTrigger: Subject<any> = new Subject();

  constructor(private router: Router, private service: SubAccountService) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      destroy: true,
      search: true,
    };
    this.get_SubEmployer();
    // this.dtTrigger.next();
  }

  get_SubEmployer () {
    this.service.view_sub_account().subscribe(res => {
      this.data = res['data'];
      // this.dtTrigger.next();
    });
  }

  checkValue(e) {
    this.admin_rights = e.target.checked;
  }

  detail() {
    this.router.navigate(['/employer/manage_subaccount/sub_accountdetail']);
   }

   edit() {
    this.router.navigate(['/employer/manage_subaccount/add_subaccounts']);
   }

   delete(id) {
     this.service.decativate_sub_account(id).subscribe(res => {
      if (res['status'] === 1) {
        console.log(res);
        this.rerender();
      }
     });
   }

   onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
   }

   ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

   ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // dtInstance.draw();
      // this.data = [];
      this.service.view_sub_account().subscribe((res) => {
        if (res['status'] === 1) {
          dtInstance.destroy();
          this.data = res['data'];
          setTimeout(() => {
            this.dtTrigger.next();
          });
          // this.dtTrigger.next();
        }
      });
    });
  }
}
