import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray
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
  buttonTitle = 'Submit';
  panelTitle = 'Add';
  user_detail: any = {};
  candidate: any = [];
  candidateList: any = [];
  country: any = [];
  countryList: any = [];
  salary_bracket: any = [];
  salarybracketList: any = [];
  location: any = [];
  locationList: any = [];
  customfield: any = [];
  group_optoins: any = [];
  arrayItems: any = [];
  key: any ;
  custom_field: any = [];

  salary_duration_optoins = [
    { label: 'Select', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' }
  ];
  // salary_bracket_optoins = [{ label: 'Select', value: '' }];
  offer_type_optoins = [
    { label: 'Select', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  // group_optoins = [{ label: 'Select', value: '' }];
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
      candidate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
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
      notes: new FormControl(''),
      employer_id: new FormControl(''),
      customfieldItem: this.fb.array([])
    });
  }


  findemail(e) {

  }

  findData = (value) => {
    this.salarybracketList = [];
    this.country.forEach(element => {
      if (value.value === element.country_id) {
        this.offer_data.currency_type = element.currency;
      }
    });

    this.service.get_salary_bracket().subscribe((res) => {
      this.salary_bracket =  res['data'];
      console.log('get_salary_bracket : res.data ==> ', res[`data`]);
      // this.salarybracketList = res[`data`];
      res['data'].forEach(element => {
        if (value.value  === element.country._id) {
          this.salarybracketList.push({ 'label': element.from + ' - ' + element.to , 'value': element.country._id });
        }
      });
    }, (err) => {
      console.log(err);
    });

    this.service.get_location(value.value).subscribe(res => {
      console.log(res['data']);
      this.location = res[`data`].data;
      // console.log('getLocaion : location ==> ', this.location);
      // res['data'].forEach(element => {
      //   console.log('log location : element ==> ', element);
      //   if (value.value === element.country._id) {
      //     this.locationList.push({ 'label': element.from + '-' + element.to , 'value': element.country._id });
      //   }
      // });
    }, (err) => {
      console.log(err);
    });
  }

  ngOnInit() {
    this.service.get_candidate_list().subscribe(res => {
      console.log('res=>', res['data']);
       this.candidate = res['data'];
      res['data'].forEach(element => {
        this.candidateList.push({ 'label': element.firstname + ' ' + element.lastname , 'value': element.user_id });
      });
      console.log('======>', this.candidateList);
    }, (err) => {
      console.log(err);
    });

    this.service.get_salary_country().subscribe(res => {
      this.country = res['data'];
      // this.countryList = res[`data`];
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country_name, 'value': element.country_id });
      });
      console.log('------------------->',  this.countryList);
    }, (err) => {
      console.log(err);
    });

    this.service.get_customfield().subscribe(res => {
      this.customfield = res['data'];
       const _array = [];
      this.customfield.forEach((element, index) => {
        const new_customfield = {
          'key': element.key
        };
        this.customfieldItem.setControl(index, this.fb.group({
          key : [''],
        }));
        _array.push(new_customfield);
      });
       this.offer_data.customfieldItem = _array;
        console.log('log arrayitems ==> ', _array);
    }, (err) => {
      console.log(err);
    });

    this.service.get_groups().subscribe(res => {
      this.group_optoins = res['data'].data;
      console.log('group_optoins',  this.group_optoins);
    }, (err) => {
      console.log(err);
    });
  }

  get customfieldItem() {
    return this.form.get('customfieldItem') as FormArray;
  }

  findEmail(value) {
    this.candidate.forEach(element => {
      if (value.value === element.user_id) {
        this.offer_data.email = element.user.email;
      }
    });
  }

  onSubmit(flag) {
    console.log('onSubmit : flag ==> ', flag);
    console.log('onSubmit : offer_data ==> ', this.offer_data);
    this.form_validation = !flag;
  }
}
