import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployerService } from '../../employer.service';
import { OfferService } from '../offer.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employer-summary',
  templateUrl: './employer-summary.component.html',
  styleUrls: ['./employer-summary.component.scss']
})
export class EmployerSummaryComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  offers: any[];
  status = true;

  constructor(
    private router: Router,
    private service: OfferService
  ) {
    console.log('employer - offer: employer-summary component => ');
  }

  ngOnInit() {
    // setTimeout(() => {

    //   this.bind();
    // }, 100);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      serverSide: true,
      processing: true,
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.view_offer(dataTablesParameters).subscribe(res => {
          if (res['offer']) {
            this.offers = res['offer'];
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columns: [
        {
          data: 'createdAt'
        }, {
          data: 'title'
        }, {
          data: 'salarytype'
        }, {
          data: 'salarybracket.from'
        }, {
          data: 'expirydate'
        }, {
          data: 'joiningdate'
        }, {
          data: 'status'
        }, {
          data: 'offertype'
        }, {
          data: 'group.name'
        }, {
          data: 'commitstatus'
        }, {
          data: 'customfeild1'
        }, {
          data: 'actions'
        }
      ]
    };

  }

  detail(id) {
    this.router.navigate(['/employer/offers/offerdetail/' + id]);
  }

  edit(id) {
    this.router.navigate(['/employer/offers/add/' + id]);
  }

  delete(id) {
    this.service.deactivate_offer(id).subscribe(res => {
      this.bind();
    });
  }

  checkValue(id, e) {
    this.status = e.target.checked;
    this.service.change_status(id, this.status).subscribe(res => {
    });
  }

  onAdd() {
    this.router.navigate(['/employer/offers/add']);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public bind() {
    // this.service.view_offer().subscribe(res => {
    //   this.offers = res['data'];
    // });
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
