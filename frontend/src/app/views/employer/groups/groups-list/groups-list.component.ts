import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { GroupService } from '../manage-groups.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  viewInfo: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  groups: any[];
  userDetail: any;
  constructor(
    private router: Router,
    private service: GroupService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit(): void {
    this.bind();
  }

  detail(id) {
    this.router.navigate(['/employer/groups/communication/view/' + id]);
  }

  edit(id) {
    this.router.navigate(['employer/groups/edit/' + id]);
  }

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      accept: () => {
        this.service.deleteGroup(id).subscribe(res => {
          if (res['status']) {
            this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
            this.rrerender();
            this.bind();
          }
        }, (err) => {
          this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
        });
      }
    });
  }

  onAdd() {
    this.router.navigate(['/groups/addgroup']);
  }


  onaddDetails(id) {
    this.router.navigate(['/employer/groups/communication/edit/' + id]);
  }

  public bind() {
    if (this.userDetail.role === 'employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.lists(dataTablesParameters).subscribe(res => {
            if (res['status']) {
              this.groups = res['groups'];
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        }, columnDefs: [{ orderable: false, targets: 7 }],
        columns: [
          {
            data: 'name'
          },
          {
            data: 'high_unopened'
          },
          {
            data: 'high_notreplied'
          },
          {
            data: 'medium_unopened'
          },
          {
            data: 'medium_notreplied'
          },
          {
            data: 'low_unopened'
          },
          {
            data: 'low_notreplied'
          },
          {
            data: 'actions'
          }
        ]
      };
    } else if (this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.lists(dataTablesParameters).subscribe(res => {
            if (res['status']) {
              this.groups = res['groups'];
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        }
        // , columnDefs: [{ orderable: false, targets: 7 }]
        ,
        columns: [
          {
            data: 'name'
          },
          {
            data: 'high_unopened'
          },
          {
            data: 'high_notreplied'
          },
          {
            data: 'medium_unopened'
          },
          {
            data: 'medium_notreplied'
          },
          {
            data: 'low_unopened'
          },
          {
            data: 'low_notreplied'
          }
        ]
      };
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
