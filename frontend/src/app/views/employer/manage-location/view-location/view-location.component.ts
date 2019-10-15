import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../manage-location.service';
import { countries } from '../../../../shared/countries';
import { ConfirmationService } from 'primeng/api';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',

  styleUrls: ['./view-location.component.scss']
})
export class ViewLocationComponent implements OnInit, OnDestroy, AfterViewInit {
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

  constructor(private router: Router,
    private service: LocationService,
    private confirmationService: ConfirmationService, private toastr: ToastrService) { }
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.view_location(dataTablesParameters).subscribe(res => {
          if (res['status'] === 1) {
            this.locations = res['location'];
            console.log(this.locations);
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columnDefs: [{ orderable: false, targets: 2 }],
      columns: [
        {
          data: 'city'
        }, {
          data: 'country.country'
        }, {
          data: 'action'
        }
      ]
    };

    // setTimeout(() => {
    //   this.bind();
    // }, 100);
    this.country = countries;

  }
  detail() {
    // this.router.navigate(['/groups/summarydetail']);
  }

  edit(id) {
    this.router.navigate(['/employer/manage_location/edit_location/' + id]);
  }

  delete(id) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.deactivate_location(id).subscribe(res => {
          console.log('deactivate location', res['status']);

          if (res['status'] === 1) {
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


  public bind() {
    // this.service.view_location().subscribe(res => {
    //   this.locations = res['data']['data'];
    //   this.locations = this.locations.filter(x => x.is_del === false);
    //   this.Country = countries;
    //   const obj = [];
    //   for (const [key, value] of Object.entries(countries)) {
    //     obj.push({ 'code': key, 'name': value });
    //   }
    //   this.Country = obj;
    //   this.locations.forEach(element => {
    //     const fetch_country = element.country;
    //     this.unique = this.Country.filter(x => x.code === fetch_country);
    //     this._country.push(this.unique[0]);
    //   });
    //   this._country = this._country.filter(this.onlyUnique);
    // });
  }

  // public GetCountry(country) {
  //   this.c_name = this._country.filter(x => x.code === country);
  //   this.c_name = this.c_name[0].name;
  //   return this.c_name;
  // }

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
