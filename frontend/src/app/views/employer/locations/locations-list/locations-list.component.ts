import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LocationService } from '../location.service';
import { ConfirmationService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { countries } from '../../../../shared/countries';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  country: any = [];
  locations: any[];
  loc: any;
  salary: any = [];
  _country: any = [];
  unique: any;
  Country: any;
  location: any;
  c_name: any = [];
  sal: any = [];
  salnew: any = [];
  userDetail: any;
  constructor(
    private router: Router,
    private service: LocationService,
    private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    if (this.userDetail.role === 'employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_location(dataTablesParameters).subscribe(res => {
            console.log('location response =>>', res);

            if (res['status'] === 1) {
              this.locations = res['location'];
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        },
        columnDefs: [{ orderable: false, targets: 1 }],
        columns: [
          {
            data: 'city'
          },
          // {
          //   data: 'country.country'
          // },
          {
            data: 'action'
          }
        ]
      };
    } else if (this.userDetail.role === 'sub-employer') {
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        serverSide: true,
        processing: true,
        order: [[0, 'desc']],
        language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
        destroy: true,
        ajax: (dataTablesParameters: any, callback) => {
          this.service.view_location(dataTablesParameters).subscribe(res => {
            console.log('location response =>>', res);

            if (res['status'] === 1) {
              this.locations = res['location'];
              callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
            }
          }, err => {
            callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
          });
        },
        //  columnDefs: [{ orderable: false, targets: 1 }],
        columns: [
          {
            data: 'city'
          },
          // {
          //   data: 'country.country'
          // },
          //  {
          //    data: 'action'
          //  }
        ]
      };
    }
    this.country = countries;
  }


  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      accept: () => {
        this.service.deactivate_location(id).subscribe(res => {
          console.log('>>', res['message']);

          if (res['resp_data'].status === 1) {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          }
          this.rrerender();
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
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
