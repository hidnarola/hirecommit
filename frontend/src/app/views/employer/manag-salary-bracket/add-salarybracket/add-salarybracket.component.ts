import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { countries } from '../../../../shared/countries';
import { Currency } from '../../../../shared/currency';
import { SalaryBracketService } from '../manag-salary-bracket.service';
@Component({
  selector: 'app-add-salarybracket',
  templateUrl: './add-salarybracket.component.html',
  styleUrls: ['./add-salarybracket.component.scss']
})
export class AddSalarybracketComponent implements OnInit {
  AddSalaryBracket: FormGroup;
  submitted = false;
  Country: any = [];
  currency: any = [];
  location: any;
  unique: any = [];
  _country: any = [];
  id: any;
  salary: any;
  detail: any = [];
  panelTitle: string;
  buttonTitle: string;
  error = false;
  error_msg = 'can\'t be less then minimum salary!';
  constructor(private fb: FormBuilder, private router: Router, private service: SalaryBracketService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.AddSalaryBracket = new FormGroup({
      country: new FormControl(null, [Validators.required]),
      currency: new FormControl(),
      from: new FormControl(null, [Validators.required]),
      to: new FormControl(null, [Validators.required])
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.service.get_location().subscribe(res => {
      this.location = res['data'];
    });
    this.getDetail(this.id);
  }
  
  findCities()
  {
      this.detail.currency = this.detail.country.country.currency_code;
  }

  onBlurMethod(from, to) {
      if (from > to ) {
        this.error = true;
        this.error_msg = 'can\'t be less then minimum salary!';
      } else if (from >= to) {
      this.error = true;
      this.error_msg = 'Can\'t be same!';
    } else {
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
    if (this.id && flag) {
      // console.log(this.AddSalaryBracket.value);return false;
      this.service.edit_salary_bracket(this.id, this.AddSalaryBracket.value).subscribe(res => {
        console.log('edited successfully!!!');
        this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);
      });
    } else if (!this.id && flag) {
    this.submitted = !flag;
      this.service.add_salary_brcaket(this.AddSalaryBracket.value).subscribe(res => {
        console.log('addded', res);
        this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);
      });
      if (flag) {
        this.AddSalaryBracket.reset();
      }
    }
  }


  onClose() {
    this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);
  }



}
