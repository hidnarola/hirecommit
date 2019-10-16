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
      country: new FormControl('', [Validators.required]),
      currency: new FormControl(),
      from: new FormControl('', [Validators.required]),
      to: new FormControl('', [Validators.required])
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log(this.id);
    });

    this.service.get_location().subscribe(res => {
      console.log('res=>', res['data']);
      this.currency = res['data']
      res['data'].forEach(element => {
        console.log('element', element);
        this.countryList.push({ 'label': element.country, 'value': element.id })
      });
      // this.contryList.push()
      // this.contryList = res['data'];
      // this.contryList = this.location
      console.log('country list', this.countryList);

    });

    this.getDetail(this.id);
  }

  findCities() {
    this.detail.currency = this.detail.country.country.currency_code;
  }
  findCurrency(value) {
    console.log('cur', value.value);
    this.currency.forEach(element => {
      console.log('element >>', element);
      if (value.value === element.id) {
        this.detail.currency = element.currency;
      }
      // this.currency=this.currency.filter(x => x.element === value.value)
      // console.log(this.currency);

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


  getDetail(id: string) {
    if (this.id) {
      this.panelTitle = 'Edit Salary Bracket';
      this.buttonTitle = 'Update';
      this.service.get_salary_bracket_detail(id).subscribe(res => {
        this.detail = res['data'][0];
        this.detail.country = res['data'][0].location;
        this.detail.currency = res['data'][0].location.country.currency_code;
        console.log('subscribed!', this.detail);
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
      this.service.edit_salary_bracket(this.id, this.AddSalaryBracket.value).subscribe(res => {
        console.log('edited successfully!!!');
        this.router.navigate([this.cancel_link]);
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
        }
      }, (err) => {
        console.log('error msg ==>', err['error']['message']);

        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });

      if (flag) {
        this.AddSalaryBracket.reset();
      }
    }
  }





}
