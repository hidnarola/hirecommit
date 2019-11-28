import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SubAccountService } from '../sub-accounts.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../../employer.service';
import { CommonService } from '../../../../services/common.service';
import { EmployerService as emp } from '../../../admin/employers/employer.service';
@Component({
  selector: 'app-sub-accounts-list',
  templateUrl: './sub-accounts-list.component.html',
  styleUrls: ['./sub-accounts-list.component.scss']
})
export class SubAccountsListComponent implements OnInit, AfterViewInit, OnDestroy {
  // @ViewChild('content', { static: false }) content: ElementRef;
  msg: any;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  sub_accounts: any = [];
  data: any = [];
  admin_rights;
  obj: any;
  userDetail: any = [];
  subAccountList: any = [];
  _profile_data: any;
  id: any;
  constructor(
    private router: Router,
    private service: SubAccountService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private EmpService: EmployerService,
    private commonService: CommonService,
    private employer_admin_Service: emp,
    private route: ActivatedRoute,
  ) {

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.userDetail = this.commonService.getLoggedUserDetail();
    console.log('userDetail === check here ==>', this.userDetail);

    this.commonService.profileData().then(res => {
      console.log('res=>', res);

      this._profile_data = res[0];
      console.log('_profile_data=========>', this._profile_data);

    });
  }

  ngOnInit(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        searching: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_sub_account(dataTablesParameters).subscribe(res => {

            if (res['status']) {
              this.data = res['user'];
              this.subAccountList = [];
              this.data.forEach(element => {
                if (element.user.admin_rights === 'no') {
                  this.obj = {
                    username: element.username,
                    email: element.user.email,
                    admin_rights: false,
                    user_id: element.user_id
                  };
                  this.subAccountList.push(this.obj);


                } else if (element.user.admin_rights === 'yes') {
                  this.obj = {
                    username: element.username,
                    email: element.user.email,
                    admin_rights: true,
                    user_id: element.user_id
                  };
                  this.subAccountList.push(this.obj);
                  // if (this.subAccountList.length == 0) {
                  //   var el = document.getElementById('DataTables_Table_0_paginate');
                  //   el.style.display = 'none';
                  // }
                }

              });
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        },
        columnDefs: [{ orderable: false, targets: 3 },
        { targets: 0, width: '35%' },
        { targets: 1, width: '30%' },
        { targets: 2, width: '15%' }],
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
    } else if (this.userDetail.role === 'admin') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        searching: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          dataTablesParameters['id'] = this.id;
          this.employer_admin_Service.get_sub_employers(dataTablesParameters).subscribe(res => {

            if (res['status']) {
              this.data = res['user'];
              this.subAccountList = [];
              this.data.forEach(element => {
                if (element.user.admin_rights === 'no') {
                  this.obj = {
                    username: element.username,
                    email: element.user.email,
                    admin_rights: false,
                    user_id: element.user_id
                  };
                  this.subAccountList.push(this.obj);


                } else if (element.user.admin_rights === 'yes') {
                  this.obj = {
                    username: element.username,
                    email: element.user.email,
                    admin_rights: true,
                    user_id: element.user_id
                  };
                  this.subAccountList.push(this.obj);
                  // if (this.subAccountList.length == 0) {
                  //   var el = document.getElementById('DataTables_Table_0_paginate');
                  //   el.style.display = 'none';
                  // }
                }

              });
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        },
        columnDefs: [{ orderable: false, targets: 3 },
        { targets: 0, width: '35%' },
        { targets: 1, width: '30%' },
        { targets: 2, width: '15%' }],
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
  }

  get_SubEmployer() { }

  checkValue(e) {
    if (e.target.checked === true) {
      this.admin_rights = 'yes';
    } else if (e.target.checked === false) {
      this.admin_rights = 'no';
    }
  }
  open(content) {
    this.modalService.open(content);
    this.EmpService.information({ 'msg_type': 'sub_accounts' }).subscribe(res => {
      this.msg = res['message'];
    });
  }

  delete(user_id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this record?',
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
    if (e.checked === false) {
      this.obj = {
        'id': id,
        'admin_rights': 'no'
      };
      this.service.admin_rigth(this.obj).subscribe(res => {
        this.toastr.success('Admin Rights Revoke.', 'Success!', { timeOut: 1000 });
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else if (e.checked === true) {
      this.obj = {
        'id': id,
        'admin_rights': 'yes'
      };
      this.service.admin_rigth(this.obj).subscribe(res => {
        this.toastr.success('Admin Rights Granted.', 'Success!', { timeOut: 1000 });
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
