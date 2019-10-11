import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { countries } from '../../../../shared/countries';
import { OfferService } from '../offer.service';
import { Currency } from '../../../../shared/currency';
import { cc, bb, aa } from '../../../../shared/countries2';
@Component({
  selector: 'app-employer-addoffer',
  templateUrl: './employer-addoffer.component.html',
  styleUrls: ['./employer-addoffer.component.scss']
})
export class EmployerAddofferComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  form_validation = false;
  offer_data: any = {};
  location: any;
  unique: any = [];
  _country: any = [];
  Country: any = [];
  currency: any = [];
  buttonTitle = 'Submit';
  panelTitle = 'Add';
  countryArr: any[] = [];
  arr: any[] = [];
  salary_duration_optoins = [
    { label: 'Select', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' },
  ];
  contryList: any;

  ngAfterViewInit(): void {
    const arr1 = [];
   for (const c of this.arr) {
    let o = {};
      aa.forEach(a => {
      if (c.country === a.country) {
        o = { ...c, ...a };
      }
     });
    arr1.push(o);
   }
   this.countryArr = [ ...arr1];
  }
  constructor(
    private fb: FormBuilder, private service: OfferService
    ) {
       // Form Controls
       this.form = this.fb.group({
        email: new FormControl('', [Validators.required, Validators.email]),
        name: new FormControl('', [Validators.required]),
        title: new FormControl('', [Validators.required]),
        salarytype: new FormControl('', [Validators.required]),
        salaryduration: new FormControl(''),
        country: new FormControl('', [Validators.required]),
        location: new FormControl('', [Validators.required]),
        currency_type: new FormControl(),
        salarybracket: new FormControl('', [Validators.required]),
        expirydate: new FormControl('', [Validators.required]),
        joiningdate: new FormControl('', [Validators.required]),
        status: new FormControl(),
        offertype: new FormControl('', [Validators.required]),
        group: new FormControl('', [Validators.required]),
        commitstatus: new FormControl('', [Validators.required]),
        customfeild1: new FormControl(''),
        customfeild2: new FormControl(''),
        customfeild3: new FormControl(''),
        notes: new FormControl(''),
        employer_id: new FormControl('')
       });
   }
   findCities = () => {
    this.service.get_location(this.offer_data.country).subscribe(res => {
      this.location = res['data']['data'];
      // this.location.forEach(element => {
      //   const fetch_country = element.country;
      //   this.unique = this.contryList.filter(x => x.value === fetch_country);
      //   this._country.push(this.unique[0]);
      // });
      console.log(this.location);
      // this.currency = Currency;
      // const obj = [];
      // for (const [key, value] of Object.entries(this.currency)) {
      //   obj.push({ 'code': key, 'currency': value });
      // }
      // this.currency = obj;
      // this.currency = this.currency.find(x => x.code === e);

      // this._country = this._country.filter(this.onlyUnique);
      // console.log('this._country ==> ', this._country);
    });
   }

   selectCountry(e) {
     console.log('event : e ==> ', e);
   }

  ngOnInit() {
    const obj = [];
    // for (const [key, value] of Object.entries(countries)) {
    //   obj.push({ 'value': key, 'label': value });
    // }
    this.contryList = obj;
    // console.log('init : contries ==> ', this.contryList);


for (const c of cc) {
     let o = {};
     bb.forEach(b => {
       if (c.alpha2Code === b.abbreviation) {
         o = { ...c, ...b };
       }
     });
    this.arr.push(o);
   }
// console.log(' : arr1 ==> ', arr1);
   }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // submit form
  onSubmit(flag) {
    this.offer_data.location = this.offer_data.location._id;
    console.log('onSubmit : flag ==> ', flag);
    console.log('onSubmit : offer_data ==> ', this.offer_data);
    this.form_validation = !flag;
  }

}
