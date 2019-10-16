import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { OfferService } from '../offer.service';
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
  user_detail: any = {};
  candidate: any[];

  salary_duration_optoins = [
    { label: 'Select', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' }
  ];
  salary_bracket_optoins = [{ label: 'Select', value: '' }];
  offer_type_optoins = [
    { label: 'Select', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  group_optoins = [{ label: 'Select', value: '' }];
  commitstatus_optoins = [
    { label: 'Select', value: '' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  contryList: any;
  cancel_link = '/employer/offers/list';

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private commonService: CommonService
  ) {
    // Form Controls
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required]),
      title: new FormControl('', [Validators.required]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl({ value: '', disabled: true }),
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
      customfield1: new FormControl(''),
      customfield2: new FormControl(''),
      customfield3: new FormControl(''),
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

  ngOnInit() {
    this.service.get_candidate_list().subscribe(res => {
      console.log('res=>', res['data']);
       this.candidate = res['data'];
        res['data'].forEach(element => {
        console.log('element', element);
        // this.candidate.push({ 'label': element.firstname + element.lastname , 'value': element.id });
      });
    }, (err) => {
      console.log(err);
    });



    //  this.service.get_location().subscribe(res => {
    //   console.log('res=>', res['data']);
    //   this.currency = res['data']
    //   res['data'].forEach(element => {
    //     console.log('element', element);
    //     this.countryList.push({ 'label': element.country, 'value': element.id })
    //   });
  }



  // submit form
  onSubmit(flag) {
    // this.offer_data.location = this.offer_data.location._id;
    console.log('onSubmit : flag ==> ', flag);
    console.log('onSubmit : offer_data ==> ', this.offer_data);
    this.form_validation = !flag;
  }
}
