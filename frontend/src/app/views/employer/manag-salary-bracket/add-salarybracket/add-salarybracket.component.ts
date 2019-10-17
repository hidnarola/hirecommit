import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { countries } from '../../../../shared/countries';
import { Currency } from '../../../../shared/currency';
import { ToastrService } from 'ngx-toastr';
import { SalaryBracketService } from '../manag-salary-bracket.service';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-add-salarybracket',
  templateUrl: './add-salarybracket.component.html',
  styleUrls: ['./add-salarybracket.component.scss']
})
export class AddSalarybracketComponent implements OnInit {
  countryList: any = [];
  AddSalaryBracket: FormGroup;
  submitted = false;
  Country: any = [];
  currency: any = [];
  location: any = {};
  unique: any = [];
  _country: any = [];
  id: any;
  salary: any;
  detail: any = [];
  panelTitle: string;
  buttonTitle: string;
  error = false;
  error_msg = 'can\'t be less then minimum salary!';
  error_msg1 = 'can\'t be greater then maximum salary!';
  cancel_link = '/employer/salary_brackets/list';

  constructor(private fb: FormBuilder,
    private router: Router,
    private service: SalaryBracketService,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.AddSalaryBracket = new FormGroup({
      location: new FormControl('', [Validators.required]),
      currency: new FormControl(),
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required])
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log('eid',this.id);
    });

    this.service.get_location().subscribe(res => {
      this.currency = res['data']
      console.log('from currency =>', this.currency);

      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country, 'value': element.id })
      });
    });

    this.getDetail(this.id);
  }

  // findCities() {
  //   this.detail.currency = this.detail.country.country.currency_code;
  // }
  findCurrency(value) {
    this.currency.forEach(element => {
      if (value.value === element.id) {
        this.detail.currency = element.currency;
      }
    })

  }

  onBlurMethod(from, to) {
    if (from > to) {
      this.error = true;
      this.error_msg = 'can\'t be less then minimum salary!';
    } else if (from >= to) {
      this.error = true;
      this.error_msg = 'Can\'t be same!';
    }
    else {
      this.error = false;
    }
  }
  onBlur(from, to) {
    if (from > to) {
      this.error = true;
      this.error_msg = 'Can\'t greater than maximum salary!';
    }
    else if (from <= to) {
      this.error = true;
      this.error_msg1 = 'Can\'t be same!';
    }
    else {
      this.error = false;
    }
  }


  getDetail(id) {
    if (id) {
      this.panelTitle = 'Edit Salary Bracket';
      this.buttonTitle = 'Update';
      this.service.get_salary_bracket_detail(id).subscribe(res => {
        this.detail = res['data']['data'];
        // this.detail.country = res['data'][0].location;
        // this.detail.currency = res['data'][0].location.country.currency_code;
        console.log('subscribed!', res['data']['data']);
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
      this.buttonTitle = 'submit';
      this.AddSalaryBracket.reset();
    }
  }


  get f() {
    return this.AddSalaryBracket.controls;
  }

  onSubmit(flag: boolean, id) {
    console.log(!this.id, flag);

    this.submitted = true;
    if (this.id && flag) {
      this.service.edit_salary_bracket(id, this.AddSalaryBracket.value).subscribe(res => {
        console.log('edited successfully!!!');
        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        this.router.navigate([this.cancel_link]);
      }, (err) => {
        this.toastr.error(err['error']['message'].msg, 'Error!', { timeOut: 3000 });
      });
    } else if (!this.id && flag) {
      console.log('in add');

      this.submitted = !flag;
      this.service.add_salary_brcaket(this.AddSalaryBracket.value).subscribe(res => {
        console.log('addded', res);
        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.AddSalaryBracket.reset();
          this.router.navigate([this.cancel_link])
        }
      }, (err) => {
        console.log('>>>>', err['message']);

        this.toastr.error(err['message'][0].msg, 'Error!', { timeOut: 3000 });
      });

      if (flag) {
        this.AddSalaryBracket.reset();
      }
    }
  }





}
