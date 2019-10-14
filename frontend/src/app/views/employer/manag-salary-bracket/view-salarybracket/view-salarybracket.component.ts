import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryBracketService } from '../manag-salary-bracket.service';
import { countries } from '../../../../shared/countries';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-view-salarybracket',
  templateUrl: './view-salarybracket.component.html',
  styleUrls: ['./view-salarybracket.component.scss']
})
export class ViewSalarybracketComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger:  Subject<any> = new Subject();
  Country: any;
  salary: any[];
  location: any;
  unique: any = [];
  _country: any = [];
  c_name: any = [];
  sal: any = [] ;
  salnew: any = [];

  unq: any;
  constructor(private router: Router, private confirmationService: ConfirmationService,private service: SalaryBracketService) { }
  ngOnInit() {
    this.bind();
  }

  detail() {
    // this.router.navigate(['/groups/summarydetail']);
  }

  edit(id) {
    this.router.navigate(['/employer/manage_salarybracket/add_salarybracket/' + id]);
  }

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.deactivate_salary_brcaket(id).subscribe(res => {
          console.log('deactivate salary', res);
          this.rrerender();
          this.bind();
        });
      }
    });
  }

  onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public bind() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log('dataTablesParameters', dataTablesParameters);
        this.service.view_salary_brcaket(dataTablesParameters).subscribe(res => {
          if (res['status'] === 1) {
            this.salary = res['salary'];
            console.log('data==>', res);
          this.salary = this.salary.filter(x => x.is_del === false);
          this.Country = countries;
          const obj = [];
          for (const [key, value] of Object.entries(countries)) {
            obj.push({ 'code': key, 'name': value });
          }
          this.Country = obj;
          this.salary.forEach(element => {
            const fetch_country = element.country;
            this.unique = this.Country.filter(x => x.code === fetch_country);
            this._country.push(this.unique[0]);
          });
          this._country = this._country.filter(this.onlyUnique);


            callback({recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: []});
          }
        }, err => {
          callback({recordsTotal: 0, recordsFiltered: 0, data: []});
        });
      },
      columns: [
        {
          data: 'country'
        },
        {
          data: 'currency'
        },
        {
          data: 'from'
        },
        {
          data: 'to'
        },
        {
          data: 'action'
        }
      ]
    };
  }

  public GetCountry(country) {
    this.c_name = this._country.filter(x => x.code === country);
    this.c_name = this.c_name[0].name;
    return this.c_name;
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
