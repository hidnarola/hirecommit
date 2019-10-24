import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { OfferService } from '../offer.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../employer/groups/manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-offer-add-view',
  templateUrl: './offer-add-view.component.html',
  styleUrls: ['./offer-add-view.component.scss']
})
export class OfferAddViewComponent implements OnInit {
  public Editor = ClassicEditor;
  resData: any;
  form: FormGroup;
  form_validation = false;
  offer_data: any = {};
  panelTitle;
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
  id: any;
  is_Edit: boolean = false;
  // salary duration options
  salary_duration_optoins = [
    { label: 'Select Salary Duration', value: '' },
    { label: '1 week', value: '1week' },
    { label: '2 week', value: '2week' }
  ];
  // offer type options
  offer_type_optoins = [
    { label: 'Select Offer Type', value: '' },
    { label: 'No Commit', value: 'noCommit' },
    { label: 'Candidate Commit', value: 'candidateCommit' },
    { label: 'Both Commit', value: 'bothCommit' }
  ];
  // commit status options
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
  communicationData: any = [];
  is_disabled_btn = false;
  profileData: any;

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private commonService: CommonService
  ) {
    // Form Controls
    this.form = this.fb.group({
      candidate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      title: new FormControl('', [Validators.required]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl(''),
      // country: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      // currency_type: new FormControl('', [Validators.required]),
      salarybracket: new FormControl('', [Validators.required]),
      expirydate: new FormControl('', [Validators.required]),
      joiningdate: new FormControl('', [Validators.required]),
      status: new FormControl(),
      offertype: new FormControl('', [Validators.required]),
      group: new FormControl('', [Validators.required]),
      commitstatus: new FormControl('', [Validators.required]),
      notes: new FormControl(''),
      employer_id: new FormControl(''),
      customfieldItem: this.fb.array([]),
      communicationFieldItems: this.fb.array([])
    });

    this.commonService.getDecryptedProfileDetail().then(res => {
      console.log('const : res => ', res);
      this.profileData = res;
    });
    this.getLocation();

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    console.log('this.router => ', this.route.snapshot.data.title);
  }

  get f() { return this.form.controls; }

  // custom field items controls
  get customfieldItem() {
    return this.form.get('customfieldItem') as FormArray;
  }

  // communication field items controls
  get communicationFieldItems() {
    return this.form.get('communicationFieldItems') as FormArray;
  }

  // Update form validation
  updateValidation() {
    this.form.updateValueAndValidity();
  }

  // get country list
  async findData(value) {
    console.log('value.value => ', value.value);
    this.salarybracketList = [];
    this.country.forEach(element => {
      console.log('value.value === element.country_id => ', value.value === element.country_id);
      if (value.value === element.country_id) {
        // this.offer_data.currency_type = element.currency;
        // this.form.controls.currency_type.setValue(element.currency);
      }
    });
    const promise = new Promise((resolve, reject) => {
      this.service.get_location(value.value).subscribe(
        async res => {
          console.log('res for location => ', res);
          this.location = await res[`data`].data;
          console.log('location', this.location);
          this.salary_bracket = await res['salary'].data;
          this.salary_bracket.forEach(element => {
            this.salarybracketList.push({
              label: element.from + ' - ' + element.to,
              value: element._id
            });
          });

          if (this.route.snapshot.data.title === 'Edit') {
            const locationById = this.location.find(x => x._id === this.resData.location._id);
            this.form.controls.location.setValue(locationById);

            const salarybracketById = this.salarybracketList.find(x => x.value === this.resData.salarybracket._id);
            this.form.controls.salarybracket.setValue(salarybracketById.value);

          }
          resolve(this.salarybracketList);
        },
        err => {
          console.log(err);
          reject(err);
        });
    });
    return promise;
  }

  // get location
  getLocation() {
    const promise = new Promise((resolve, reject) => {
      this.service.get_locations().subscribe(
        async res => {
          console.log('res for location => ', res);
          this.location = await res[`data`].data;
          console.log('location', this.location);
          this.salary_bracket = await res['salary'].data;
          this.salary_bracket.forEach(element => {
            this.salarybracketList.push({
              label: element.from + ' - ' + element.to,
              value: element._id
            });
          });

          if (this.route.snapshot.data.title === 'Edit') {
            const locationById = this.location.find(x => x._id === this.resData.location._id);
            this.form.controls.location.setValue(locationById);

            const salarybracketById = this.salarybracketList.find(x => x.value === this.resData.salarybracket._id);
            this.form.controls.salarybracket.setValue(salarybracketById.value);

          }
          resolve(this.salarybracketList);
        },
        err => {
          console.log(err);
          reject(err);
        });
    });
    return promise;
  }

  //  On change of salary type
  getSalaryType() {
    console.log(
      'this.form.controls.salaryType => ',
      this.form.value.salarytype
    );
  }

  ngOnInit() {
    //   To get candidates list
    this.getCandidateList()
      .then(res => {
        this.getCountryList();
      })
      .then(res => {
        this.groupList();
      })
      .then(res => {
        if (this.route.snapshot.data.title !== 'Edit') {
          this.customFieldList();
        }
      })
      .then(res => {
        if (this.route.snapshot.data.title === 'Edit') {
          this.panelTitle = 'Edit';

          this.getDetail();
        } else {
          this.panelTitle = 'Add';

        }
      });
  }

  getDetail() {
    this.service.offer_detail(this.id).subscribe(
      res => {
        console.log('offer detail ===> api res==>', res);
        this.resData = res[`data`];
        console.log('Response ====>', this.resData);
        // set communication
        console.log('check herre => ', res['communication']);
        if (res['data']['communication'] && res['data']['communication'].length > 0) {
          console.log('in function => ');
          this.communicationData = res['data']['communication'];
          const _communication_array = [];
          this.communicationData.forEach((element, index) => {
            console.log('element => ', element);
            const new_communication = {
              'communicationname': element.communicationname,
              'trigger': element.trigger,
              'priority': element.priority,
              'day': element.day,
              'message': element.message,
            };
            this.communicationFieldItems.setControl(index, this.fb.group({
              communicationname: ['', Validators.required],
              trigger: ['', Validators.required],
              priority: ['', Validators.required],
              day: ['', Validators.required],
              message: ['']
              // message: ['', Validators.required]
            }));
            _communication_array.push(new_communication);
          });
          this.communicationData = _communication_array;
        }
        // set communication
        this.form.controls['candidate'].setValue(this.resData.user_id);
        this.getCandidateDetail(this.resData.user_id);
        this.form.controls['title'].setValue(this.resData.title);
        this.form.controls.salarytype.setValue(res['data'].salarytype);
        this.form.controls['salaryduration'].setValue(this.resData.salaryduration);
        this.getCountryDetail(this.resData.country);
        this.findData({ 'value': this.resData.country });
        this.form.controls['expirydate'].setValue(new Date(this.resData.expirydate));
        this.form.controls['joiningdate'].setValue(new Date(this.resData.joiningdate));
        this.form.controls['offertype'].setValue(this.resData.offertype);
        this.groupDetail(this.resData.groups);
        this.form.controls['commitstatus'].setValue(this.resData.commitstatus);
        this.form.controls['notes'].setValue(this.resData.notes);
        const _array = [];
        this.resData['customfeild'].forEach((element, index) => {
          const new_customfield = {
            key: element.key,
            value: element.value
          };
          this.customfieldItem.setControl(
            index,
            this.fb.group({
              value: [element.value],
              key: [element.key]
            })
          );
          this.customfieldItem.updateValueAndValidity();
          _array.push(new_customfield);
        });
        this.offer_data.customfieldItem = _array;
      },
      err => {
        console.log(err);
      }
    );
  }

  // get candidate details
  async getCandidateList() {
    console.log('get candidate list function==> ');
    const promise = new Promise((resolve, reject) => {
      this.service.get_candidate_list().subscribe(
        async res => {
          this.candidate = await res['data'];
          // res['data'].forEach(element => {
          for (const element of res['data']) {
            this.candidateList.push({
              label: element.firstname + ' ' + element.lastname,
              value: element.user_id
            });
          }
          console.log(' : this.candidate list ==> ', this.candidateList);
          resolve(this.candidate);
        }, err => {
          console.log('getCandidateList : err ==> ', err);
          reject(err);
        });
    });
    return promise;
  }

  // get candidate detail
  async getCandidateDetail(id) {
    console.log('candidate id, detail function===>', id);
    const candidateDataById = this.candidate.filter(x => x.user._id === id);
    console.log('candidateDataById', candidateDataById);
    this.form.controls.email.setValue(candidateDataById[0].user.email);
  }

  async getCountryList() {
    this.service.get_salary_country().subscribe(
      res => {
        this.country = res['data'];
        console.log('country ==> ', res);
        res['data'].forEach(element => {
          this.countryList.push({
            label: element.country_name,
            value: element.country_id
          });
        });
      },
      err => {
        console.log(err);
      }
    );
  }

  async getCountryDetail(id) {
    const countryById = this.country.filter(x => x.country_id === id);
    this.form.controls.country.setValue(countryById[0].country_id);
  }

  // get customField list
  async customFieldList() {
    this.service.get_customfield().subscribe(
      res => {
        this.customfield = res['data'];
        const _array = [];
        this.customfield.forEach((element, index) => {
          const new_customfield = {
            key: element.key,
            value: ''
          };
          this.customfieldItem.setControl(
            index,
            this.fb.group({
              value: [''],
              key: [element.key]
            })
          );
          _array.push(new_customfield);
        });
        this.offer_data.customfieldItem = _array;
      },
      err => {
        console.log(err);
      }
    );
  }

  // get group list
  async groupList() {
    this.service.get_groups().subscribe(
      res => {
        this.group_optoins = res['data'].data;
        console.log('group_optoins', this.group_optoins);
      },
      err => {
        console.log(err);
      }
    );
  }

  async groupDetail(id) {
    const groupById = this.group_optoins.find(x => x._id === id);
    this.form.controls.group.setValue(groupById);
  }

  // on change of group
  // changeGroup() {
  //   console.log('this.form.value.group._id => ', this.form.value.group._id);
  //   // this.add_new_communication();
  //   // this.communicationDetail(this.form.value.group._id);
  // }

  // // get communication detail by id
  // communicationDetail(id) {
  //   this.communicationData = [];
  //   console.log('function called => ');
  //   this.groupService.get_detail(id).subscribe(res => {
  //     console.log('res of communication details by id => ', res);
  //     if (res['communication']['data'] && res['communication']['data'].length > 0) {
  //       this.communicationData = res['communication']['data'][0]['communication'];
  //       // set communication
  //       const _array = [];
  //       this.communicationData.forEach((element, index) => {
  //         console.log('element => ', element);
  //         const new_communication = {
  //           'communicationname': element.communicationname,
  //           'trigger': element.trigger,
  //           'priority': element.priority,
  //           'day': element.day,
  //           'message': element.message,
  //         };
  //         this.communicationFieldItems.setControl(index, this.fb.group({
  //           communicationname: ['', Validators.required],
  //           trigger: ['', Validators.required],
  //           priority: ['', Validators.required],
  //           day: ['', Validators.required],
  //           message: ['']
  //           // message: ['', Validators.required]
  //         }));
  //         _array.push(new_communication);
  //       });
  //       this.communicationData = _array;
  //       // set communication
  //     } else {
  //       this.add_new_communication();
  //     }
  //   });

  // }

  // add more communication
  addMoreCommunication() {
    this.is_disabled_btn = true;
    this.add_new_communication();
  }

  // add new communication
  add_new_communication(data_index = null) {
    let index = 0;
    if (data_index == null) {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      } else {
        this.communicationData = [];
      }
    } else {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      }
    }
    const new_communication = {
      'communicationname': '',
      'trigger': '',
      'priority': '',
      'day': '',
      'message': '',
    };

    this.communicationFieldItems.setControl(index, this.fb.group({
      communicationname: ['', Validators.required],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      message: ['']
      // message: ['', Validators.required]
    }));

    this.communicationData.push(new_communication);
    this.updateValidation();
  }

  // Remove communication
  remove_communication(index: number) {
    delete this.communicationData[index];
    this.communicationFieldItems.removeAt(index);
    const array = [];
    for (let i = 0; i < this.communicationData.length; i++) {
      if (this.communicationData[i] !== undefined) {
        array.push(this.communicationData[i]);
      }
    }
    this.communicationData = array;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  findEmail(value) {
    this.candidate.forEach(element => {
      if (value.value === element.user_id) {
        this.form.controls.email.setValue(element.user.email);
      }
    });
  }

  // submit offers
  onSubmit(flag) {
    // customised fields
    const _coustomisedFieldsArray = [];
    this.form.value.customfieldItem.forEach(element => {
      // if (element.value) {
      _coustomisedFieldsArray.push({
        key: element.key,
        value: element.value
      });
      // }
    });
    // communication records
    const communication_array = [];
    if (this.communicationData.length > 0) {
      this.communicationData.forEach(element => {
        communication_array.push({
          communicationname: element.communicationname,
          trigger: element.trigger,
          priority: element.priority,
          day: element.day,
          message: element.message
        });
      });
    } else {
      communication_array.push();
    }
    this.formData = new FormData();
    const unwantedFields = [
      'candidate',
      'customfieldItem',
      'group',
      'status',
      'employer_id',
      'communicationFieldItems'
    ];
    const data = {
      ...this.form.value,
      user_id: this.form.value.candidate,
      location: this.form.value.location._id,
      groups: this.form.value.group._id,
      country: this.profileData._id,
      customfeild: JSON.stringify(_coustomisedFieldsArray),
      data: JSON.stringify(communication_array)
    };
    console.log('data => ', data);
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
      if (this.route.snapshot.data.title === 'Edit') {
        this.show_spinner = true;
        this.formData.append('id', this.id);
        console.log('this.formData ==> ', this.formData);
        this.service.update_offer(this.formData).subscribe(
          res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.router.navigate([this.cancel_link]);
          },
          err => {
            console.log('err => ', err);
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', {
              timeOut: 3000
            });
          }
        );
      } else {
        this.show_spinner = true;
        console.log('this.formData ==> ', this.formData);
        this.service.add_offer(this.formData).subscribe(
          res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.router.navigate([this.cancel_link]);
          },
          err => {
            console.log('err => ', err);
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', {
              timeOut: 3000
            });
          }
        );
      }

    }
    this.form_validation = !flag;
  }

}
