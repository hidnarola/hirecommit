import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SocketService } from '../../../../services/socket.service';
import { OfferService } from '../offer.service';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/common.service';
import { ConfirmationService } from 'primeng/api';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
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
  empId = '5dc177fc1b81361795365fa1';
  offerData: any[];
  form = false;
  accept_btn: boolean = false;
  profileData: any = [];
  // offer type options
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  hide_list = false;
  grpId: string;
  userDetail: any = [];
  constructor(
    private service: OfferService,
    private route: Router,
    private commonService: CommonService,
    private confirmationService: ConfirmationService,
    private socketService: SocketService,
    private spinner: NgxSpinnerService,
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.userDetail.role === 'employer') {
      this.getCustomField();
    }
    // To show spinner
     this.spinner.show();
  }

  // get first custom field
  getCustomField() {
    this.service.get_first_custom_field().subscribe(res => {
      if (res['data']) {
        this.first_custom_field = res['data'][0]['key'];
      } else {
        this.first_custom_field = 'Custom Field';
      }
    });
  }

joinGroup = (id) => {
this.socketService.joinGrp(id);
}

  ngOnInit() {

    this.socketService.getOffer().subscribe(res => {
      console.log('Client : res ==> ', res);
      this.rrerender();
    });

    if (this.userDetail.role !== 'admin') {
      this.commonService.getprofileDetail.subscribe(async res => {
        if (res) {

          this.profileData = res;
          console.log('from profile +>>', this.profileData);
          if (this.userDetail.role === 'employer') {
            console.log('i m emp ==> ');
            this.grpId = this.profileData.user_id;
            this.joinGroup(this.profileData.user_id);
          } else if (this.userDetail.role === 'candidate') {
            console.log('i m can ==> ');
            this.grpId = this.profileData.user_id;
            this.joinGroup(this.profileData.user_id);
          } else if (this.userDetail.role === 'sub-employer') {
            console.log(' i m sub ==> ');
            this.grpId = this.profileData.emp_id;
             this.joinGroup(this.profileData.emp_id);
          }
        } else {
          const profile = await this.commonService.decrypt(localStorage.getItem('profile'));
          console.log('profile==>', profile);

          if (profile) {
            this.profileData = JSON.parse(profile);
            if (!this.profileData.email_verified) {
              this.hide_list = true;
            }

            if (this.userDetail.role === 'employer') {
            console.log('i m emp ==> ');
            this.grpId = this.profileData.user_id;
            this.joinGroup(this.profileData.user_id);
          } else if (this.userDetail.role === 'candidate') {
            console.log('i m can ==> ');
            this.grpId = this.profileData.user_id;
            this.joinGroup(this.profileData.user_id);
          } else if (this.userDetail.role === 'sub-employer') {
            console.log(' i m sub ==> ');
            this.grpId = this.profileData.emp_id;
             this.joinGroup(this.profileData.emp_id);
          }

          } else {
            console.log('profile data not found');
          }
        }
      });
    } else {
      console.log('it is admin!');
    }

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
            if (res['status']) {
                       // To hide spinner
          this.spinner.hide();
              this.offerData = res['offer'];
              this.offerData.forEach(offer => {
                offer.offertype = (this.offer_type_optoins
                  .find(o => o.value === offer.offertype).label);
              });
              callback({
                recordsTotal: res[`recordsTotal`],
                recordsFiltered: res[`recordsTotal`],
                data: []
              });
            }
          }, err => {
                     // To hide spinner
          this.spinner.hide();
            console.log('err => ', err);
          });
        },
        columnDefs: [{ orderable: false, targets: 11 }],
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
            data: 'status'
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
            if (res['status']) {
                       // To hide spinner
          this.spinner.hide();
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
                     // To hide spinner
          this.spinner.hide();
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

  history(id) {
    if (this.userDetail.role === 'employer') {
      this.route.navigate(['/employer/offers/history/' + id]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.route.navigate(['/sub_employer/offers/history/' + id]);
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
    this.accept_btn = true;
    const obj = {
      'id': id
    };
    this.service.offer_accept(obj).subscribe(res => {
      console.log('accepted!!', res['data']['data'].employer_id);

      this.socketService.leaveGrp(this.grpId);
       this.socketService.joinGrp(res['data']['data'].employer_id);
      this.socketService.changeOffer(res['data']['data'].employer_id);
      this.socketService.leaveGrp(res['data']['data'].employer_id);
      this.joinGroup(this.grpId);

      this.rrerender();
      // this.s
      this.accept_btn = false;
      if (res['data'].status === 1) {
        Swal.fire(
          {
            type: 'success',
            text: res['message']
          }
        );
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
    this.socketService.leaveGrp(this.grpId);
  }

}
