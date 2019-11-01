import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfferService } from '../offer.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, AfterViewInit, OnDestroy {
  checked1: boolean = true;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // first_custom_field: any;
  first_custom_field = 'Custom Field';
  employer: any;
  offerData: any[];
  form = false;

  // offer type options
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];

  userDetail: any = [];
  constructor(
    private service: OfferService,
    private route: Router,
    private commonService: CommonService,
    private confirmationService: ConfirmationService
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    console.log('candidate: offerlist component => ', this.userDetail);
    console.log('userDetails => ', this.userDetail);
    if (this.userDetail.role === 'employer') {
      this.getCustomField();
    }
  }

  // get first custom field
  getCustomField() {
    this.service.get_first_custom_field().subscribe(res => {
      console.log('res for first custom field => ', res);
      if (res['data']) {
        this.first_custom_field = res['data']['key'];
      } else {
        this.first_custom_field = 'Custom Field';
      }
    });
  }

  ngOnInit() {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {

          this.service.view_offer(dataTablesParameters).subscribe(res => {
            console.log('res => ', res);
            if (res['status']) {
              this.offerData = res['offer'];
              this.offerData.forEach(offer => {
                offer.offertype = (this.offer_type_optoins.find(o => o.value === offer.offertype).label);
              });
              callback({
                recordsTotal: res[`recordsTotal`],
                recordsFiltered: res[`recordsTotal`],
                data: []
              });
            }
          }, err => {
            console.log('err => ', err);
          });
        },
        columnDefs: [{ orderable: false, targets: 10 }],
        columns: [
          {
            data: 'createdAt'
          },
          {
            data: 'title'
          },
          {
            data: 'salarytype'
          },
          {
            data: 'salarybracket.from'
          },
          {
            data: 'expirydate'
          },
          {
            data: 'joiningdate'
          },
          // {
          //   data: 'status'
          // },
          {
            data: 'offertype'
          },
          {
            data: 'group.name'
          },
          {
            data: 'commitstatus'
          },
          {
            data: 'customfeild[0].key'
          },
          {
            data: 'actions'
          }
        ]
      };
    } else if (this.userDetail.role === 'candidate') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {

          this.service.view_offer_candidate(dataTablesParameters).subscribe(res => {
            console.log('res => ', res);
            if (res['status']) {
              this.offerData = res['offer'];
              this.offerData.forEach(offer => {
                offer.offertype = (this.offer_type_optoins.find(o => o.value === offer.offertype).label);
              });
              callback({
                recordsTotal: res[`recordsTotal`],
                recordsFiltered: res[`recordsTotal`],
                data: []
              });
            }
          }, err => {
            console.log('err => ', err);
          });
        },
        columnDefs: [{ orderable: false, targets: 6 }],
        columns: [
          {
            data: 'createdAt'
          },
          {
            data: 'title'
          },
          {
            data: 'salarytype'
          },
          {
            data: 'salarybracket.from'
          },
          {
            data: 'expirydate'
          },
          {
            data: 'joiningdate'
          },
          // {
          //   data: 'status'
          // },
          // {
          //   data: 'offertype'
          // },
          // {
          //   data: 'group.name'
          // },
          // {
          //   data: 'commitstatus'
          // },
          // {
          //   data: 'customfeild[0].key'
          // },
          {
            data: 'actions'
          }
        ]
      };
    }
  }

  edit(id) {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/edit/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/edit/' + id]);
    }
  }

  detail(id) {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/view/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/view/' + id]);
    } else if (this.userDetail.role === 'candidate') {
      this.route.navigate(['/candidate/offers/view/' + id]);
    }
  }
  add() {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/add']);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/add']);
    }
  }
  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.deactivate_employer_offer(id).subscribe(res => {
          this.rrerender();
        });
      }
    });
  }

  onAccept(id) {
    console.log('accept id', id);
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.offer_accept(obj).subscribe(res => {
          console.log('accepted!!');
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
