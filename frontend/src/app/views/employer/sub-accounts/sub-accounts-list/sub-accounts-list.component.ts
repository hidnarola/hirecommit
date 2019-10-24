import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sub-accounts-list',
  templateUrl: './sub-accounts-list.component.html',
  styleUrls: ['./sub-accounts-list.component.scss']
})
export class SubAccountsListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  sub_accounts: any = [];
  data: any = [];
  admin_rights;
  obj: any;
  subAccountList: any = [];

  constructor(
    private router: Router,
    private service: SubAccountService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService
  ) { }

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
        this.service.view_sub_account(dataTablesParameters).subscribe(res => {

          if (res['status']) {
            this.data = res['user'];
            this.subAccountList = [];
            this.data.forEach(element => {
              console.log(element);
              if (element.user.admin_rights === 'no') {
                this.obj = {
                  username : element.username,
                  email: element.user.email,
                  admin_rights: false,
                  user_id : element.user_id
                };
                this.subAccountList.push(this.obj);
              } else if (element.user.admin_rights === 'yes') {
                this.obj = {
                  username : element.username,
                  email: element.user.email,
                  admin_rights: true,
                  user_id : element.user_id
                };
                this.subAccountList.push(this.obj);
              }
              console.log('====>', this.subAccountList);
            });
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columnDefs: [{ orderable: false, targets: 3 }],
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

  edit() {
    console.log('function called => ');
  }

  get_SubEmployer() { }

  checkValue(e) {
    if (e.target.checked === true) {
      this.admin_rights = 'yes';
    } else if (e.target.checked === false) {
      this.admin_rights = 'no';
    }
  }

  delete(user_id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.decativate_sub_account(user_id).subscribe(res => {
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

  changeRights(e, id) {
    console.log(e.checked, id);
    if (e.checked === false) {
      this.obj = {
        'id': id,
        'admin_rights': 'no'
      };
       this.service.admin_rigth(this.obj).subscribe(res => {
          this.toastr.success('Admin Rights Revoke.' , 'Success!', { timeOut: 1000 });
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
    } else if (e.checked === true) {
      this.obj = {
        'id':  id,
        'admin_rights': 'yes'
      };
      this.service.admin_rigth(this.obj).subscribe(res => {
          this.toastr.success('Admin Rights Granted.' , 'Success!', { timeOut: 1000 });
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
    }
  }

  rrerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy() {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
