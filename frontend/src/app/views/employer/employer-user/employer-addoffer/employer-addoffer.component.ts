import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { countries } from '../../../../shared/countries';
import { OfferService } from '../offer.service';
import { Currency } from '../../../../shared/currency';
import { cc, bb, aa } from '../../../../shared/countries2';
import { CommonService } from '../../../../services/common.service';
@Component({
  selector: 'app-employer-addoffer',
  templateUrl: './employer-addoffer.component.html',
  styleUrls: ['./employer-addoffer.component.scss']
})
export class EmployerAddofferComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder, private service: OfferService, private commonService: CommonService
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

      //  To Get all country data
       this.getCountryData();
   }

   getCountryData()  {
    this.commonService.country_data().subscribe(res => {
      this.countryArr = res[`data`];
      console.log('getCountryData : res ==> ', res);
    });
   }

   

   selectCountry(e) {
     console.log('event : e ==> ', e);
   }

  ngOnInit() {
   }

  findCities = () => {
    this.service.get_location(this.offer_data.country).subscribe(res => {
      this.location = res['data']['data'];
    });
  }

  // submit form
  onSubmit(flag) {
    this.offer_data.location = this.offer_data.location._id;
    console.log('onSubmit : flag ==> ', flag);
    console.log('onSubmit : offer_data ==> ', this.offer_data);
    this.form_validation = !flag;
  }

}
