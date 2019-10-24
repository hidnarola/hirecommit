import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CandidateService } from '../candidate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  candidates: any[];
  userDetail: any = [];
  candidate_type = 'Approved';
  doc: any;
  constructor(
    private service: CandidateService,
    private route: Router,
    private router: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService

  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    console.log('this.userDetail => ', this.userDetail);
    console.log('admin- candidate: newcandidate - list component => ');
    console.log('this.router => ', this.router.snapshot.data.type);
    if (this.router.snapshot.data.type === 'new') {
      this.candidate_type = 'New';
    }
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      order: [[0, 'desc']],
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        if (this.router.snapshot.data.type === 'approved' && this.userDetail.role === 'employer') {
          this.service.get_approved_candidate(dataTablesParameters).subscribe(res => {
            console.log('res of approved candidates => ', res);
            if (res['status'] === 1) {
              this.candidates = res['user'];
              console.log('this.candidates  => ', this.candidates);
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        } else if (this.router.snapshot.data.type === 'new' && this.userDetail.role === 'employer') {
          this.service.get_new_candidate(dataTablesParameters).subscribe(res => {
            console.log('res of new candidates => ', res);
            if (res['status'] === 1) {
              this.candidates = res['user'];
              this.doc = res['user']['document'];
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        } else if (this.router.snapshot.data.type === 'approved' && this.userDetail.role === 'admin') {
          this.service.get_approved_candidate_admin(dataTablesParameters).subscribe(res => {
            console.log('res of approved candidates => ', res);
            if (res['status'] === 1) {
              this.candidates = res['user'];
              this.doc = res['user'][0]['document'].name;
              console.log('res=>', res['user'][0]['document'].name);
              console.log('this.candidates  => ', this.candidates);
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        } else if (this.router.snapshot.data.type === 'new' && this.userDetail.role === 'admin') {
          this.service.get_new_candidate_admin(dataTablesParameters).subscribe(res => {
            console.log('res of new candidates => ', res);
            if (res['status'] === 1) {
              this.candidates = res['user'];
              this.doc = res['user']['document'];


              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        }
      },
      columnDefs: [{ orderable: false, targets: 6 }],
      columns: [
        {
          data: 'firstname'
        }, {
          data: 'user.email'
        }, {
          data: 'contactno'
        }, {
          data: 'documenttype'
        }, {
          data: 'createdAt'
        }, {
          data: 'status'
        }, {
          data: 'action'
        }
      ]
    };
  }

  onApproved(id) {
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.approved(obj).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 1000 });
          this.rrerender();
        }, (err) => {
          console.log(err);
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 1000 });
        });
      }
    });
  }

  onDelete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.deactivate_candidate(id).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 1000 });
          this.rrerender();
        }, (err) => {
          console.log(err);
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 1000 });
        });
      }
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
