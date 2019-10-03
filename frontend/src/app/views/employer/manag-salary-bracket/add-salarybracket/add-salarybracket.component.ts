import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormControl, Validators } from '@angular/forms';
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
  constructor(private router: Router, private service: SalaryBracketService, private route: ActivatedRoute) { }

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
    })

    this.getDetail(this.id)

    this.Country = countries;
    var obj = [];

    for (let [key, value] of Object.entries(countries)) {
      obj.push({ 'code': key, 'name': value });
    }
    this.Country = obj;
    console.log(this.Country);

    this.service.get_location().subscribe(res => {
      this.location = res['data']['data'];

      console.log(this.location);
      this.location.forEach(element => {
        let fetch_country = element.country;
        this.unique = this.Country.filter(x => x.code === fetch_country);
        this._country.push(this.unique[0]);
      });
      this._country = this._country.filter(this.onlyUnique);

    })
  }
  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  getDetail(id: string) {
    if (id === '0') {
      this.detail =
        {
          _id: null,
          country: null,
          currency: null,
          from: null,
          to: null,

        };
      this.panelTitle = 'Add Salary Bracket';
      this.buttonTitle = "Add";
      this.AddSalaryBracket.reset();
    }
    else {
      this.panelTitle = 'Edit Salary Bracket';
      this.buttonTitle = "Edit";
      this.service.get_salary_bracket_detail(id).subscribe(res => {
      this.detail = res['data']['data']
        console.log("subscribed!", this.detail);
      });
      // console.log('incoming salary', this.detail);
    }
  }

  onChange(e) {

    //location
    // this.service.get_location().subscribe(res => {
    //   this.location1 = res['data']['data'];
    //   this.location1 = this.location1.filter(x => x.country === e);

    //currency
    this.currency = Currency;
    var obj = [];
    for (let [key, value] of Object.entries(this.currency)) {
      obj.push({ 'code': key, 'currency': value });
    }
    this.currency = obj;
    this.currency = this.currency.find(x => x.code === e);
    this.AddSalaryBracket.controls.currency.setValue(this.currency.currency);
  }

  get f() {
    return this.AddSalaryBracket.controls;
  }

  onSubmit(flag: boolean, id) {
    console.log("get id", id);
    if (id != 0) {
      this.service.edit_salary_bracket(this.id, this.AddSalaryBracket.value).subscribe(res => {
        console.log('edited successfully!!!');
        this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);
      })
    }
    else {
    this.submitted = !flag;
      console.log("added salary", this.AddSalaryBracket.value);
      this.service.add_salary_brcaket(this.AddSalaryBracket.value).subscribe(res => {
        console.log("addded");
        this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);
      })
      if (flag) {
        this.AddSalaryBracket.reset();
      }
    }

  }


  onClose() {
    this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);

  }

  // onEdit(){
  //   if(this.buttonTitle === 'Edit'){
  //     this.service.edit_salary_bracket(this.id, this.AddSalaryBracket.value).subscribe(res => {
  //       console.log('edited successfully!!!');

  //     })
  //   }
  // }

}
