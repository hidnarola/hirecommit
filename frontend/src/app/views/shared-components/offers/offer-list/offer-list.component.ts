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
  checked1: boolean = true;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  // first_custom_field: any;
  first_custom_field = 'Custom Field 1';
  employer: any;
  offerData: any[];
  form = false;

  constructor(
    private service: OfferService,
    private route: Router
  ) {
    console.log('candidate: offerlist component => ');
    this.getCustomField();
  }

  // get first custom field
  getCustomField() {
    this.service.get_first_custom_field().subscribe(res => {
      console.log('res for first custom field => ', res);
      if (res['data']) {
        this.first_custom_field = res['data']['key'];
      } else {
        this.first_custom_field = 'Custom Field 1';
      }
    });
  }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
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
        });
      },
      columnDefs: [{ orderable: false, targets: 10 }], // 11
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
  }

  edit(id) {
    this.route.navigate(['/employer/offers/edit/' + id]);
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
