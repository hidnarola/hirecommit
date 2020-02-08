import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SalaryBracketService } from '../salary-bracket.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-salary-bracket-add-view',
  templateUrl: './salary-bracket-add-view.component.html',
  styleUrls: ['./salary-bracket-add-view.component.scss']
})
export class SalaryBracketAddViewComponent implements OnInit {

  countryList: any = [];
  AddSalaryBracket: FormGroup;
  submitted = false;
  currency: any = [];
  location: any = {};
  id: any;
  salary: any;
  detail: any = [];
  panelTitle: string;
  decyptCountry: any;
  error = false;
  error_msg = 'can\'t be less then minimum salary!';
  error_msg1 = 'can\'t be greater then maximum salary!';
  cancel_link = '/employer/salary_brackets/list';
  obj: any;
  addSalary: any;
  cnt1: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private service: SalaryBracketService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService) { }

  ngOnInit() {
    this.AddSalaryBracket = new FormGroup({
      // country: new FormControl('', [Validators.required]),
      // currency: new FormControl(),
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required])
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.get_location().subscribe(res => {
      this.currency = res['data'];
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country, 'value': element.country_id });
      });
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });

    this.getDetail(this.id);

    this.commonService.getprofileDetail.subscribe(async res => {
      if (res) {
        this.decyptCountry = res;
      } else {
        const _country = await this.commonService.decrypt(localStorage.getItem('profile'));
        if (_country) {
          this.decyptCountry = JSON.parse(_country);
          this.cnt1 = this.decyptCountry.country;
        } else {
          console.log(' country data not found');
        }
      }
    });
  }

  findCities() {
    this.detail.currency = this.detail.country.country.currency_code;
  }
  findCurrency(value) {
    this.currency.forEach(element => {
      if (value.value === element.country_id) {
        this.detail.currency = element.currency;
      }
    });

  }

  onBlurMethod(from, to) {
    if (from > to) {
      this.error = true;
      this.error_msg = 'can\'t be less then minimum salary!';
    } else if (from >= to) {
      this.error = true;
      this.error_msg = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }
  onBlur(from, to) {
    if (from > to) {
      this.error = true;
      this.error_msg = 'Can\'t greater than maximum salary!';
    } else if (from <= to) {
      this.error = true;
      this.error_msg1 = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }


  getDetail(id) {
    if (id) {
      this.panelTitle = 'Edit Salary Bracket';
      this.service.get_salary_bracket_detail(id).subscribe(res => {
        this.detail.country = res['data'].country._id;
        this.detail.currency = res['data'].country.currency_code;
        this.detail.from = res['data'].from;
        this.detail.to = res['data'].to;
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      this.detail = {
        _id: null,
        country: null,
        currency: null,
        from: null,
        to: null,
      };
      this.panelTitle = 'Add Salary Bracket';
      this.AddSalaryBracket.reset();
    }
  }


  get f() {
    return this.AddSalaryBracket.controls;
  }



  onSubmit(flag: boolean, id) {
    this.submitted = true;
    if (this.id && flag) {
      this.obj = {
        'id': this.id,
        'country': this.detail['country'],
        'currency': this.detail['currency'],
        'from': this.detail['from'],
        'to': this.detail['to']
      };

      this.service.edit_salary_bracket(this.obj).subscribe(res => {
        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        this.router.navigate([this.cancel_link]);
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    } else if (!this.id && flag) {
      this.submitted = !flag;
      this.addSalary = {
        'country': this.cnt1,
        'currency': 'INR',
        'from': this.AddSalaryBracket.value['from'],
        'to': this.AddSalaryBracket.value['to']
      };
      this.service.add_salary_brcaket(this.addSalary).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.AddSalaryBracket.reset();
          this.router.navigate([this.cancel_link]);
        }
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });

      if (flag) {
        this.AddSalaryBracket.reset();
      }
    }
  }

}
