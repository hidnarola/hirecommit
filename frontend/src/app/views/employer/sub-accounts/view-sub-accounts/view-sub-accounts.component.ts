import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

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

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private service: SubAccountService, private confirmationService: ConfirmationService, private toastr: ToastrService) { }
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      searching: true,
      processing: true,
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
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
    // console.log(id);
    this.router.navigate(['/employer/sub_accounts/edit/' + id]);
  }

  delete(user_id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.decativate_sub_account(user_id).subscribe(res => {
          console.log('deactivate sub account', res['status']);
          if (res['status'] === 1) {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          }
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
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
