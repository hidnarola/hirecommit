import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { CustomFieldService } from '../custom-field.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployerService } from '../../employer.service';

@Component({
  selector: 'app-custom-field-list',
  templateUrl: './custom-field-list.component.html',
  styleUrls: ['./custom-field-list.component.scss']
})
export class CustomFieldListComponent implements OnInit, AfterViewInit, OnDestroy {
  msg: any;
  data: any[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  userDetail: any;
  _profile_data: any;
  constructor(private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private service: CustomFieldService,
    private router: Router,
    private commonService: CommonService,
    private modalService: NgbModal,
    private EmpService: EmployerService
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    this.commonService.profileData().then(res => {
      this._profile_data = res[0];
    });
  }

  ngOnInit() {
    this.bind();
  }

  public bind() {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        // order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_custom_feild(dataTablesParameters).subscribe(res => {
            console.log('custom feild res =>>', res);
            if (res['status'] === 1) {
              this.data = res['salary'];
              callback({ recordsTotal: res['recordsTotal'], recordsFiltered: res['recordsTotal'], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        }, columnDefs: [{ orderable: false, targets: 2 }, { targets: 0, width: '10%' }, { targets: 1, width: '100%' }],
        columns: [
          {
            data: 'index'
          },
          {
            data: 'key'
          },
          {
            data: 'action'
          }
        ]
      };
    }
    //  else if (this.userDetail.role === 'sub-employer') {
    //   this.dtOptions = {
    //     pagingType: 'full_numbers',
    //     pageLength: 10,
    //     serverSide: true,
    //     processing: true,
    //     // order: [[0, 'desc']],
    //     language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
    //     destroy: true,
    //     ajax: (dataTablesParameters: any, callback) => {
    //       this.service.view_custom_feild(dataTablesParameters).subscribe(res => {
    //         console.log('custom feild res =>>', res);

    //         if (res['status'] === 1) {
    //           this.data = res['salary'];
    //           // if (this.data.length == 0) {
    //           //   var el = document.getElementById('DataTables_Table_0_paginate');
    //           //   el.style.display = 'none';
    //           // }
    //           callback({ recordsTotal: res['recordsTotal'], recordsFiltered: res['recordsTotal'], data: [] });
    //         }
    //       }, err => {
    //         callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
    //       });
    //     },
    //     columnDefs: [{ targets: 0, width: '10%' }, { targets: 1, width: '100%' }],
    //     columns: [
    //       {
    //         data: 'index'
    //       },
    //       {
    //         data: 'key'
    //       },
    //       // {
    //       //   data: 'action'
    //       // }
    //     ]
    //   };
    // }

  }

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this record?',
      accept: () => {
        this.service.delete_custom_field(id).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          }
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    });
  }
  open(content) {
    this.modalService.open(content);
    this.EmpService.information({ 'msg_type': 'custom_field' }).subscribe(res => {
      console.log('res=>', res);
      this.msg = res['message']
    });
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
