import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { OfferService } from '../offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  employer: any;
  offerData: any[];
  form = false;

  constructor(
    private service: OfferService,
    private route: Router
  ) {
    console.log('candidate: offerlist component => ');
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.view_offer(dataTablesParameters).subscribe(res => {
          console.log('res => ', res);
          if (res['status']) {
            this.offerData = res['offer'];
            callback({
              recordsTotal: res[`recordsTotal`],
              recordsFiltered: res[`recordsTotal`],
              data: []
            });
          }
        }, err => {
          console.log('err => ', err);
          //   callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columnDefs: [{ orderable: false, targets: 11 }],
      columns: [
        {
          data: 'created_at'
        },
        {
          data: 'title'
        },
        {
          data: 'salary_type'
        },
        {
          data: 'salary_bracket'
        },
        {
          data: 'expiry_date'
        },
        {
          data: 'joining_date'
        },
        {
          data: 'status'
        },
        {
          data: 'offer_type'
        },
        {
          data: 'group'
        },
        {
          data: 'commit_status'
        },
        {
          data: 'custom_field1'
        },
        {
          data: 'actions'
        }
      ]
    };
  }

  onDelete(id) {
    this.service.deactivate_employer_offer(id).subscribe(res => {
      this.rrerender();
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
