import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-offer-add-view',
  templateUrl: './offer-add-view.component.html',
  styleUrls: ['./offer-add-view.component.scss']
})
export class OfferAddViewComponent implements OnInit {
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
  key: any;
  custom_field: any = [];
  salary_duration_optoins = [
    { label: 'Select Salary Duration', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' }
  ];
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  commitstatus_optoins = [
    { label: 'Select Commit Status', value: '' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
  ];
  contryList: any;
  cancel_link = '/employer/offers/list';
  show_spinner = false;
  formData: FormData;

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Form Controls
    this.form = this.fb.group({
      candidate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      title: new FormControl('', [Validators.required]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl(''),
      country: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      currency_type: new FormControl('', [Validators.required]),
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

  // delivery property get method
  get customfieldItem() {
    return this.form.get('customfieldItem') as FormArray;
  }

  findData = (value) => {
    this.salarybracketList = [];
    this.country.forEach(element => {
      if (value.value === element.country_id) {
        // this.offer_data.currency_type = element.currency;
        this.form.controls.currency_type.setValue(element.currency);
      }
    });

    this.service.get_salary_bracket().subscribe((res) => {
      this.salary_bracket = res['data'];
      // this.salarybracketList = res[`data`];
      res['data'].forEach(element => {
        if (value.value === element.country._id) {
          this.salarybracketList.push({ 'label': element.from + ' - ' + element.to, 'value': element._id });
        }
      });
    }, (err) => {
      console.log(err);
    });

    this.service.get_location(value.value).subscribe(res => {
      this.location = res[`data`].data;
    }, (err) => {
      console.log(err);
    });
  }

  //  On change of salary type
  getSalaryType() {
    console.log('this.form.controls.salaryType => ', this.form.value.salarytype);
  }

  ngOnInit() {
    this.service.get_candidate_list().subscribe(res => {
      this.candidate = res['data'];
      res['data'].forEach(element => {
        this.candidateList.push({ 'label': element.firstname + ' ' + element.lastname, 'value': element.user_id });
      });
    }, (err) => {
      console.log(err);
    });

    this.service.get_salary_country().subscribe(res => {
      this.country = res['data'];
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country_name, 'value': element.country_id });
      });
    }, (err) => {
      console.log(err);
    });

    this.service.get_customfield().subscribe(res => {
      this.customfield = res['data'];
      const _array = [];
      this.customfield.forEach((element, index) => {
        const new_customfield = {
          'key': element.key,
          'value': ''
        };
        this.customfieldItem.setControl(index, this.fb.group({
          value: [''],
          key: [element.key]
        }));
        _array.push(new_customfield);
      });
      this.offer_data.customfieldItem = _array;
    }, (err) => {
      console.log(err);
    });

    this.service.get_groups().subscribe(res => {
      this.group_optoins = res['data'].data;
      console.log('group_optoins', this.group_optoins);
    }, (err) => {
      console.log(err);
    });
  }

  findEmail(value) {
    this.candidate.forEach(element => {
      if (value.value === element.user_id) {
        this.form.controls.email.setValue(element.user.email);
      }
    });
  }

  onSubmit(flag) {
    const _coustomisedFiledsArray = [];
    this.form.value.customfieldItem.forEach((element) => {
      if (element.value) {
        _coustomisedFiledsArray.push({
          key: element.key,
          value: element.value
        });
      }
    });
    this.formData = new FormData();
    const unwantedFields = ['candidate', 'customfieldItem', 'group', 'status', 'employer_id'];
    const data = {
      ...this.form.value,
      user_id: this.form.value.candidate,
      location: this.form.value.location._id,
      groups: this.form.value.group._id,
      customfeild: JSON.stringify(_coustomisedFiledsArray),
    };
    Object.keys(data).map(key => {
      if (unwantedFields.includes(key)) {
        delete data[key];
      }
    });

    for (const key in data) {
      if (key) {
        const value = data[key];
        this.formData.append(key, value);
      }
    }

    if (flag) {
      this.show_spinner = true;
      this.service.add_offer(this.formData).subscribe((res) => {
        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        this.router.navigate([this.cancel_link]);
      }, (err) => {
        console.log('err => ', err);
        this.show_spinner = false;
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    }
    this.form_validation = !flag;
  }

}
