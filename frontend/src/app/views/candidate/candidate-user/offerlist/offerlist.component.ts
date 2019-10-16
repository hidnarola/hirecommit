import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { OfferListService } from '../offerList.service';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-offerlist',
  templateUrl: './offerlist.component.html',
  styleUrls: ['./offerlist.component.scss']
})
export class OfferlistComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  employer: any;
  offerList: any[];
  form = false;

  constructor(private service: OfferListService, private route: Router) { }

  ngOnInit() {
    this.bind();
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 2,
    //   serverSide: true,
    //   processing: true,
    //   destroy: true,
    //   ajax: (dataTablesParameters: any, callback) => {
    //     console.log('dataTablesParameters', dataTablesParameters);
    //     this.service.view_offerList(dataTablesParameters).subscribe(res => {
    //     //   if (res['status']) {
    //     //     this.data = res['user'];
    //     //     console.log('data==>', res);
    //     //     callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
    //     //   }
    //     }, err => {
    //     //   callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
    //     });
    //   },
    //   columns: [
    //     {
    //       data: 'username'
    //     }, {
    //       data: 'user.email'
    //     }, {
    //       data: 'user.admin_rights'
    //     }, {
    //       data: 'actions'
    //     }
    //   ]
    // };
  }

  onDelete(id) {
    this.service.deactivate_offer(id).subscribe(res => {
      console.log('deactivate offer', res);
      // this.rrerender();
      this.bind();
    });
  }

  public bind() {
    this.service.view_offerList().subscribe(res => {
      this.offerList = res['data']['data'];
      console.log('candidate offer list', this.offerList);
      this.offerList = this.offerList.filter(x => x.is_del === false);
      console.log('eid', this.offerList[0].employer_id);
      this.service.get_employer(this.offerList[0].employer_id).subscribe(resp => {
        this.employer = resp['data']['data'];
        this.form = true;
        console.log('emp data', this.employer);
      });
    });
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
