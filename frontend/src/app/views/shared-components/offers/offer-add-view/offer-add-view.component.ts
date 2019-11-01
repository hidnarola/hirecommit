import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { OfferService } from '../offer.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../employer/groups/manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSpinnerService } from 'ngx-spinner';

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
  id: any;
  is_Edit: boolean = false;
  is_View: boolean = false;
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
  cancel_link1 = '/sub_employer/offers/list';
  show_spinner = false;
  formData: FormData;
  communicationData: any = [];
  is_disabled_btn = false;
  disable_salary_period = false;
  profileData: any;
  min_date = new Date();
  min_expiry_date = new Date();
  userDetail: any = [];

  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private groupService: GroupService,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
  ) {
    // show spinner
    if (this.is_Edit || this.is_View) {
      this.spinner.show();
    }
    // Form Controls
    this.form = this.fb.group({
      candidate: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      title: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl(''),
      // country: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      salarybracket: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      salarybracket_from: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
      salarybracket_to: new FormControl('', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]),
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


    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      console.log('here => ');
      this.getLocation();
    }
    if (this.userDetail.role === 'employer') {
      this.commonService.getDecryptedProfileDetail().then(res => {
        this.profileData = res;
        console.log('profiledata => ', this.profileData);
      });
    }

    // check for add or edit
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
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
    this.salarybracketList = [];
    this.country.forEach(element => {
      if (value.value === element.country_id) {
        // this.offer_data.currency_type = element.currency;
        // this.form.controls.currency_type.setValue(element.currency);
      }
    });
    const promise = new Promise((resolve, reject) => {
      this.service.get_location(value.value).subscribe(
        async res => {
          this.location = await res[`data`].data;
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
    if (this.form.value.salarytype === 'hourly') {
      this.form.controls['salaryduration'].setValidators([Validators.required]);
    } else {
      this.form.controls['salaryduration'].setValidators(null);
      this.form.controls['salaryduration'].setValue(null);
    }
    this.updateValidation();
    this.form.controls['salaryduration'].updateValueAndValidity();
  }

  ngOnInit() {
    this.userDetail = this.commonService.getLoggedUserDetail();
    //   To get candidates list
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.getCandidateList()
        .then(res => {
          this.groupList();
        })
        .then(res => {
          if (this.route.snapshot.data.title !== 'Edit' && this.route.snapshot.data.title !== 'View') {
            this.customFieldList();
            //  spinner hide
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        })
        .then(res => {
          if (this.route.snapshot.data.title === 'Edit') {
            this.panelTitle = 'Edit';
            this.is_Edit = true;
            this.getDetail();
          } else if (this.route.snapshot.data.title === 'View') {
            this.panelTitle = 'View';
            this.is_View = true;
            this.getDetail();
          } else {
            this.panelTitle = 'Add';
            this.spinner.hide();
          }
        });
    } else if (this.userDetail.role === 'candidate') {
      this.getDetail();
    }

  }

  getDetail() {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.service.offer_detail(this.id).subscribe(
        res => {
          this.resData = res[`data`];
          this.spinner.hide();
          this.getCandidateDetail(res[`data`].user_id);
          this.groupDetail(res[`data`].groups);
          if (res[`data`] && this.is_Edit) {
            // set communication
            if (res['data']['communication'] && res['data']['communication'].length > 0) {
              this.communicationData = res['data']['communication'];
              const _communication_array = [];
              this.communicationData.forEach((element, index) => {
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
            this.form.controls['candidate'].setValue(res[`data`].user_id);
            this.form.controls['title'].setValue(res[`data`].title);
            this.form.controls.salarytype.setValue(res['data'].salarytype);
            this.form.controls['salaryduration'].setValue(res[`data`].salaryduration);
            this.form.controls['location'].setValue(res[`data`]['location']);
            // this.getCountryDetail(res[`data`].country);
            // this.findData({ 'value': res[`data`].country });
            this.form.controls['expirydate'].setValue(new Date(res[`data`].expirydate));
            this.form.controls['joiningdate'].setValue(new Date(res[`data`].joiningdate));
            this.form.controls['offertype'].setValue(res[`data`].offertype);
            this.form.controls['commitstatus'].setValue(res[`data`].commitstatus);
            this.form.controls['notes'].setValue(res[`data`].notes);
            if (res[`data`].salary) {
              this.form.controls['salarybracket'].setValue(res[`data`].salary);
              document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
              document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
              this.form.controls['salarybracket_from'].setErrors(null);
              this.form.controls['salarybracket_to'].setErrors(null);
              this.updateValidation();
            }
            if (res[`data`].salary_from && res[`data`].salary_to) {
              this.form.controls['salarybracket_from'].setValue(res[`data`].salary_from);
              this.form.controls['salarybracket_to'].setValue(res[`data`].salary_to);
              document.getElementById('salarybracket').setAttribute('disabled', 'true');
              this.form.controls['salarybracket'].setErrors(null);
              this.updateValidation();
            }

            const _array = [];
            res[`data`]['customfeild'].forEach((element, index) => {
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
          }
        },
        err => {
          console.log(err);
        }
      );
    } else if (this.userDetail.role === 'candidate') {
      this.service.offer_detail_candidate(this.id).subscribe(
        res => {
          this.resData = res[`data`];
          this.spinner.hide();
          this.is_View = true;
          this.resData.candidate_name = this.profileData.firstname + ' ' + this.profileData.lastname;
          this.resData.candidate_email = this.profileData.email;
          this.resData.groupName = res[`data`].groups.name;
        });
    }
  }

  // get candidate details
  async getCandidateList() {
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
          resolve(this.candidate);
        }, err => {
          reject(err);
        });
    });
    return promise;
  }

  // get candidate detail
  async getCandidateDetail(id) {
    const candidateDataById = this.candidate.filter(x => x.user._id === id);
    this.form.controls.email.setValue(candidateDataById[0].user.email);
    if (this.is_View) {
      this.resData.candidate_name = candidateDataById[0].firstname + ' ' + candidateDataById[0].lastname;
      this.resData.candidate_email = candidateDataById[0].user.email;
    }
  }

  async getCountryList() {
    this.service.get_salary_country().subscribe(
      res => {
        this.country = res['data'];
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

  // async getCountryDetail(id) {
  //   const countryById = this.country.filter(x => x.country_id === id);
  //   this.form.controls.country.setValue(countryById[0].country_id);
  // }

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
      },
      err => {
        console.log(err);
      }
    );
  }

  async groupDetail(id) {
    const groupById = this.group_optoins.find(x => x._id === id);
    this.form.controls.group.setValue(groupById);
    if (this.is_View) {
      this.resData.groupName = groupById.name;
    }
  }

  // get joining date
  getJoiningDate() {
    this.min_expiry_date = this.form.value.joiningdate;
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

  // blur event for salary input
  onSalaryBlur() {
    if (this.form.value.salarybracket > 0) {
      document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
      document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
      this.form.controls['salarybracket_from'].setErrors(null);
      this.form.controls['salarybracket_to'].setErrors(null);
      this.updateValidation();
    } else {
      document.getElementById('salarybracket_to').removeAttribute('disabled');
      document.getElementById('salarybracket_from').removeAttribute('disabled');
    }
  }

  // blur event of salary range
  onSalaryRangeBlur() {
    if ((this.form.value.salarybracket_from > 0) && this.form.value.salarybracket_to > 0) {
      document.getElementById('salarybracket').setAttribute('disabled', 'true');
      this.form.controls['salarybracket'].setErrors(null);
      this.updateValidation();
    } else {
      document.getElementById('salarybracket').removeAttribute('disabled');
    }
  }

  cancel() {
    if (this.userDetail.role === 'employer') {
      this.router.navigate([this.cancel_link]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate([this.cancel_link1]);
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['/candidate/offers/list']);
    }
  }
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }
  // onlyInteger(control: FormControl) {
  //   if (!((control.value > 95 && control.value < 106)
  //     || (control.value > 47 && control.value < 58)
  //     || control.value == 8)) {
  //       const minusNumber
  //     return isValid ? null : { 'whitespace': true };
  //   }

  // }


  // submit offers
  onSubmit(flag) {
    // customised fields
    const _coustomisedFieldsArray = [];
    console.log('this.form.controls => ', this.form.value);
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
      'communicationFieldItems',
      'salarybracket',
      'salarybracket_from',
      'salarybracket_to',
      // 'salaryduration'
    ];
    const data = {
      ...this.form.value,
      user_id: this.form.value.candidate,
      location: this.form.value.location._id,
      groups: this.form.value.group._id,
      // country: this.profileData._id,
      salary: this.form.value.salarybracket ? this.form.value.salarybracket : '',
      salary_from: this.form.value.salarybracket_from ? this.form.value.salarybracket_from : '',
      salary_to: this.form.value.salarybracket_to ? this.form.value.salarybracket_to : '',
      customfeild: JSON.stringify(_coustomisedFieldsArray),
      data: JSON.stringify(communication_array)
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
    // if (this.form.value.salaryduration) {
    //   this.formData.append('salaryduration', this.form.value.salaryduration);
    // }

    if (flag) {
      if (this.route.snapshot.data.title === 'Edit') {
        this.show_spinner = true;
        this.formData.append('id', this.id);
        this.service.update_offer(this.formData).subscribe(
          res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate([this.cancel_link1]);
            }
          },
          err => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', {
              timeOut: 3000
            });
          }
        );
      } else {
        if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
          this.show_spinner = true;
          this.service.add_offer(this.formData).subscribe(
            res => {
              this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
              if (this.userDetail.role === 'employer') {
                this.router.navigate([this.cancel_link]);
              } else if (this.userDetail.role === 'sub-employer') {
                this.router.navigate([this.cancel_link1]);
              }
            },
            err => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'], 'Error!', {
                timeOut: 3000
              });
            }
          );
        }
        // else if (this.userDetail.role === 'sub-employer') {
        //   this.show_spinner = true;
        //   this.service.add_offer(this.formData).subscribe(
        //     res => {
        //       this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        //       this.router.navigate([this.cancel_link1]);
        //     },
        //     err => {
        //       this.show_spinner = false;
        //       this.toastr.error(err['error']['message'], 'Error!', {
        //         timeOut: 3000
        //       });
        //     }
        //   );
        // }

      }

    }
    this.form_validation = !flag;
  }


}
