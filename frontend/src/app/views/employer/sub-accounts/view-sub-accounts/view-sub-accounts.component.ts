import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({ selector: 'app-view-sub-accounts', templateUrl: './view-sub-accounts.component.html', styleUrls: ['./view-sub-accounts.component.scss'] })
export class ViewSubAccountsComponent
  implements OnDestroy,
  OnInit,
  AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  sub_accounts: any = [];
  data: any[];
  admin_rights = true;

  constructor(private router: Router, private service: SubAccountService) { }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      searching: true,
      processing: true,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log('dataTablesParameters', dataTablesParameters);
        this.service.view_sub_account(dataTablesParameters).subscribe(res => {
          if (res['status']) {
            this.data = res['user'];
            console.log('data==>', res);
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columns: [
        {
          data: 'username'
        }, {
          data: 'user.email'
        }, {
          data: 'user.admin_rights'
        }, {
          data: 'actions'
        }
      ]
    };
  }

  get_SubEmployer() { }

  checkValue(e) {
    this.admin_rights = e.target.checked;
  }

  detail() {
    this.router.navigate(['/employer/sub_accounts/sub_accountdetail']);
  }

  edit(id) {
    this.router.navigate(['/employer/sub_accounts/edit/' + id]);
  }

  delete(user_id) {
    this.service.decativate_sub_account(user_id).subscribe(res => {
      if (res['status'] === 1) {
        console.log(res);
        this.rrerender();
        // this.get_SubEmployer();
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

  rrerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
}
