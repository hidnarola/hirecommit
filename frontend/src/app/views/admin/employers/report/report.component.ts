import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, from } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../../../shared-components/offers/offer.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  offerData: any;
  id: any;
  from: any;
  to: any;
  first_custom_field = 'Custom Field';
  constructor(
    private service: EmployerService,
    private router: ActivatedRoute,
    private offerService: OfferService) {
    this.router.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    console.log('res of approved employer => ', this.id);
  }

  ngOnInit() {
    console.log(this.id);

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        // if (this.router.snapshot.data.type === 'approved') {
        this.service.offer_report(this.id, dataTablesParameters).subscribe(res => {
          console.log('res of approved employer => ', this.id);
          if (res['status'] === 1) {
            this.offerData = res['offer'];
            console.log('>>', this.offerData);

            // this.country = res['user'][0].country.country;
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
        // }
        // else if (this.router.snapshot.data.type === 'new') {
        //   this.service.get_new_employer(dataTablesParameters).subscribe(res => {
        //     console.log('res of new employer => ', res);
        //     if (res['status'] === 1) {
        //       this.offerData = res['user'];

        //       callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
        //     }
        //   }, err => {
        //     callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        //   });
        // }
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
  }
  getCustomField() {
    this.offerService.get_first_custom_field().subscribe(res => {
      console.log('res for first custom field => ', res);
      if (res['data']) {
        this.first_custom_field = res['data'][0]['key'];
      } else {
        this.first_custom_field = 'Custom Field';
      }
    });
  }
  onFrom(e) {
    var date = new Date(e);
    var month = date.getMonth() + 1;
    this.from = date.getDate() + '/' + month + '/' + date.getFullYear()
    console.log('val', date.getDate() + '/' + month + '/' + date.getFullYear());

  }

  onTo(e) {
    var date = new Date(e);
    var month = date.getMonth() + 1;
    this.to = date.getDate() + '/' + month + '/' + date.getFullYear()
    console.log('val', date.getDate() + '/' + month + '/' + date.getFullYear());
    // console.log('val 2', e);
  }
  check() {
    console.log('this.from, this,to=>', this.from, this.to);


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
