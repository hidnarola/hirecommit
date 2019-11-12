import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployerService } from '../employer.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, from } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../../../shared-components/offers/offer.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
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
    private offerService: OfferService) {
    this.router.params.subscribe((params: Params) => {
      this.id = params['id'];

      this.getCustomField(this.id);
    });
  }

  ngOnInit() {
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
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
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
  }

  getCustomField(id) {
    this.service.get_customfield(id).subscribe(res => {
      if (res['data']) {
        console.log('res\=>', res['data'][0]['key']);

        this.first_custom_field = res['data'][0]['key'];
      } else {
        this.first_custom_field = 'Custom Field';
      }
    });
  }


  onFrom(e) {
    var date = new Date(e);
    console.log('e=>', date);

    this.StartToDate = date;
    var month = date.getMonth() + 1;
    this.from = date.getFullYear() + '-' + month + '-' + date.getDate()

  }



  onTo(e) {
    var date = new Date(e);
    var month = date.getMonth() + 1;
    this.to = date.getFullYear() + '-' + month + '-' + date.getDate()
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
  }


}
