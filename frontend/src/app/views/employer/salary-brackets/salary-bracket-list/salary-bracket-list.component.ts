import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { SalaryBracketService } from '../salary-bracket.service';
import { ToastrService } from 'ngx-toastr';
import { countries } from '../../../../shared/countries';

@Component({
  selector: 'app-salary-bracket-list',
  templateUrl: './salary-bracket-list.component.html',
  styleUrls: ['./salary-bracket-list.component.scss']
})
export class SalaryBracketListComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  Country: any;
  salary: any[];
  unique: any = [];
  _country: any = [];
  c_name: any = [];
  sal: any = [];
  constructor(private router: Router,
    private confirmationService: ConfirmationService,
    private service: SalaryBracketService,
    private toastr: ToastrService) { }


  ngOnInit() {
    this.bind();
  }
  edit(id) {
    this.router.navigate(['/employer/salary_brackets/edit/' + id]);
  }

  delete(id) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.deactivate_salary_brcaket(id).subscribe(res => {
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[0, 'desc']],
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        this.service.view_salary_brcaket(dataTablesParameters).subscribe(res => {
          if (res['status'] === 1) {
            this.salary = res['salary'];
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
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columnDefs: [{ orderable: false, targets: 4 }],
      columns: [
        {
          data: 'country.country'
        },
        {
          data: 'country.currency_code'
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
