import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, from } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../../../shared-components/offers/offer.service';
import { SocketService } from '../../../../services/socket.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // dtInstance:
  offerData: any;
  id: any;
  from: any;
  to: any;
  StartToDate = new Date();
  first_custom_field = 'Custom Field';
  constructor(
    private service: EmployerService,
    private router: ActivatedRoute,
    private offerService: OfferService,
    private socketService: SocketService,
    private toastr: ToastrService) {
    this.router.params.subscribe((params: Params) => {
      this.id = params['id'];

      // this.getCustomField(this.id);
    });
  }

  joinGroup = (id) => {
    this.socketService.joinGrp(id);
  }

  ngOnInit() {
    this.socketService.getOffer().subscribe(res => {
      console.log('employer : res ==> ', res);
      this.rrerender();
    });

    // this.grpId = this.empId;
    this.joinGroup(this.id);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        if (this.from && this.to) {
          dataTablesParameters['startdate'] = this.from;
          dataTablesParameters['enddate'] = this.to;
        }
        // if (this.router.snapshot.data.type === 'approved') {
        this.service.offer_report(this.id, dataTablesParameters).subscribe(res => {
          if (res['status'] === 1) {
            this.offerData = res['offer'];
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });

      },
      columnDefs: [{ orderable: false, targets: 9 }],
      columns: [
        {
          data: 'createdAt'
        },
        {
          data: 'candidate.user.email'
        },
        {
          data: 'candidate.firstname'
        },
        {
          data: 'title'
        },
        {
          data: 'location.city'
        },
        {
          data: 'expirydate'
        },

        {
          data: 'joiningdate'
        },
        {
          data: 'acceptedAt'
        },
        {
          data: 'status'
        },
        // {
        //   data: 'commitstatus'
        // },

        {
          data: 'actions'
        }
      ]
    };
  }

  // getCustomField(id) {
  //   this.service.get_customfield(id).subscribe(res => {
  //     if (res['data']) {
  //       // console.log('res\=>', res['data'][0]['key']);

  //       this.first_custom_field = res['data'][0]['key'];
  //     } else {
  //       this.first_custom_field = 'Custom Field';
  //     }
  //   });
  // }


  onFrom(e) {
    const date = new Date(e);
    console.log('e=>', date);

    this.StartToDate = date;
    const month = date.getMonth() + 1;
    this.from = date.getFullYear() + '-' + month + '-' + date.getDate();

  }



  onTo(e) {
    const date = new Date(e);
    const month = date.getMonth() + 1;
    this.to = date.getFullYear() + '-' + month + '-' + date.getDate();
  }

  filterWithDateRange() {
    this.rrerender();
  }

  onClearFrom() {
    this.from = undefined;
    this.onClearTo();
  }


  onClearTo() {
    this.to = undefined;
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
    this.socketService.leaveGrp(this.id);
  }


}
