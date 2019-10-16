import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-newcandidate-list',
  templateUrl: './newcandidate-list.component.html',
  styleUrls: ['./newcandidate-list.component.scss']
})
export class NewcandidateListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  candidates: any[];
  userDetail: any = [];
  constructor(private service: CandidateService, private route: Router, private commonService: CommonService) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    console.log('token : userDetail ==> ', this.userDetail);
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.get_new_candidate(dataTablesParameters).subscribe(res => {
          if (res['status'] === 1) {
            console.log('====>>>>>>', res);

            this.candidates = res['user'];
            console.log(this.candidates);
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columnDefs: [{ orderable: false, targets: 2 }],
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
    this.service.approved_candidate(id).subscribe(res => {
      console.log('approved!!!');
      this.rrerender();
    });
  }
  onDelete(id) {
    this.service.deactivate_candidate(id).subscribe(res => {
      console.log('deactivate!!');
      this.rrerender();
    });

  }

  detail(id) {
    this.route.navigate([this.userDetail.role + '/candidates/view/' + id]);
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
