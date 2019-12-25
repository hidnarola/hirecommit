import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, Params, ActivatedRouteSnapshot } from '@angular/router';
import { OfferService } from '../offer.service';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../../../employer/groups/manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { EmployerService } from '../../../admin/employers/employer.service';
import Swal from 'sweetalert2';
import { SocketService } from '../../../../services/socket.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOptions } from '../../../../shared/modal_options';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { environment } from '../../../../../environments/environment';
import { NgxSummernoteDirective } from 'ngx-summernote';

declare const $: any;
@Component({
  selector: 'app-offer-add-view',
  templateUrl: './offer-add-view.component.html',
  styleUrls: ['./offer-add-view.component.scss']
})
export class OfferAddViewComponent implements OnInit, OnDestroy {
  @ViewChild('content', { static: false }) content: ElementRef;
  @ViewChild('content1', { static: false }) content1: ElementRef;
  @ViewChild('content2', { static: false }) content2: ElementRef;
  @ViewChild('editor', { static: false }) summernote: ElementRef;
  @ViewChild('editor', { static: false }) editorDir: NgxSummernoteDirective;
  userName: any;
  public Editor = ClassicEditor;
  resData: any;
  form: FormGroup;
  form_validation = false;
  offer_data: any = {};
  panelTitle = 'Add';
  user_detail: any = {};
 
  candidate: any = [];
  candidateList: any = [];
  groupForm: FormGroup;
  date: any;
  country: any = [];
  isSetCommunication = false;
  countryList: any = [];
  candidateData: any;
  salary_bracket: any = [];
  salarybracketList: any = [];
  location: any = [];
  display_msg = false;
  expirydate: any;
  joiningdate: any;
  isAccepted = false;
  isAccept = false;
  pastDetails: any;
  msg: any;
  err_msg: any;
  isShow = false;
  valueForEditor: any;
  details: any;
  groupData: any = {};
  selectedValue: string;
  Candidate: HTMLElement;
  is_communication_added = false;
  cursorPos: any;
  locationList: any = [
    { label: 'Select Location', value: '' }
  ];
  config: any = {
    height: '200px',
    uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo', 'codeBlock', 'paste']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ]
  };
  from: any;
  to: any;
  customfield: any = [];
  group_optoins: any = [{ label: 'Select Group', value: '' }];
  arrayItems: any = [];
  key: any;
  disabled: boolean = false;
  error = false;
  err_to = '';
  err_from = '';
  offerStatus: any = [];
  custom_field: any = [];
  id: any;
  Info_msg: any;
  isNoCommit: any;
  OfferID: any;
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
  Trigger_Option = [
    { label: 'Select Trigger', value: '' },
    { label: 'Before Joining', value: 'beforeJoining' },
    { label: 'After Joining', value: 'afterJoining' },
    { label: 'After Offer', value: 'afterOffer' },
    { label: 'Before Expiry', value: 'beforeExpiry' },
    { label: 'After Expiry', value: 'afterExpiry' },
    { label: 'After Acceptance', value: 'afterAcceptance' }

  ];
  contryList: any;
  cancel_link = '/employer/offers/list';
  cancel_link1 = '/sub_employer/offers/list';
  show_spinner = false;
  formData: FormData;
  communicationData: any = [];
  AdHocCommunicationData: any = [];
  is_disabled_btn = false;
  disable_salary_period = false;
  profileData: any;
  min_date = new Date();
  min_expiry_date = new Date();
  default_date =new Date();
  max_date = new Date(new Date().setFullYear(new Date().getFullYear() + 20));
  userDetail: any = [];
  offerList: any;
  grpId: string;
  getGroupDetails = false;
  isExpired = false;
  is_submitted = false;
  accept_btn = false;
  constructor(
    private fb: FormBuilder,
    private service: OfferService,
    private Groupservice: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private adminService: EmployerService,
    private socketService: SocketService,
    private modalService: NgbModal,
  ) {
    this.spinner.show();
    // Form Controls
    this.form = this.fb.group({
      candidate_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      title: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      salarytype: new FormControl('', [Validators.required]),
      salaryduration: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      salarybracket: new FormControl(''),
      salarybracket_from: new FormControl(''),
      salarybracket_to: new FormControl(''),
      expirydate: new FormControl('', [Validators.required]),
      joiningdate: new FormControl('', [Validators.required]),
      status: new FormControl(),
      offertype: new FormControl('', [Validators.required]),
      group: new FormControl(''),
      notes: new FormControl(''),
      employer_id: new FormControl(''),
      customfieldItem: this.fb.array([]),
      communicationFieldItems: this.fb.array([]),
      AdHocCommunication: this.fb.array([]),
      // summerNotes
      editor: new FormControl(''),
      offerStatus: new FormControl(''),
      acceptanceDate: new FormControl('')
    });

    this.userDetail = this.commonService.getLoggedUserDetail();
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.getLocation();
    }
    if (this.userDetail.role === 'employer') {
      this.commonService.profileData().then(res => {
        this.profileData = res;
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

  // AdHoc Communication
  get AdHocCommunication() {
    return this.form.get('AdHocCommunication') as FormArray;
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

  // salary duration positive check
  checkPositive() {
    if (this.form.value.salarytype === 'hourly') {
      if (this.form.value.salaryduration > 0) {
        this.form.controls['salaryduration'].setValue(parseFloat(this.form.value.salaryduration));
        this.form.controls['salaryduration'].setValidators([Validators.pattern(/^[0-9]*$/)]);
      }
      this.form.controls['salaryduration'].updateValueAndValidity();
    }
  }
  
  //remove Zero
   removeZero(index){
     if (this.form.controls['AdHocCommunication'].value[index].AdHoc_day > 0){
       this.form.controls['AdHocCommunication'][`controls`][index].controls['AdHoc_day'].setValue(parseFloat(this.form.value[`AdHocCommunication`][index].AdHoc_day));
     }
   }

  removeZeroCommunication(index) {
    if (this.form.controls['communicationFieldItems'].value[index].day > 0) {
      this.form.controls['communicationFieldItems'][`controls`][index].controls['day'].setValue(parseFloat(this.form.value[`communicationFieldItems`][index].day));
    }
  }

  // email blur pattern check
  checkEmail(value) {
    const email = value.target.value;
    if (this.form['controls'].email.valid) {
      this.service.email_exists({ 'email': this.form.value.email }).subscribe(res => {
      }, (err) => {
        this.form.controls['email'].setErrors({ 'isExist': true });
      });

      this.service.add_offer_pastOffer({ 'email': email }).subscribe(res => {
        this.isShow = false;
        this.pastDetails = res;
        if (this.pastDetails.ReleasedOffer.data.length > 0) {
          this.modalService.open(this.content1, ModalOptions);
          this.err_msg = this.pastDetails.ReleasedOffer.displayMessage;
        } else {
          if (this.pastDetails.data.data.length > 0 && this.pastDetails.previousOffer.data.length === 0) {
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content, ModalOptions);
            this.msg = this.pastDetails.data.displayMessage;
          } else if (this.pastDetails.data.data.length === 0 && this.pastDetails.previousOffer.data.length > 0) {
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content1, ModalOptions);
            this.err_msg = this.pastDetails.previousOffer.displayMessage;
            console.log('this.pastDetails.previousOffer.displayMessage=>', this.pastDetails.previousOffer.displayMessage);

          }
          if ((this.pastDetails.data.data.length > 0) && (this.pastDetails.previousOffer.data.length > 0)) {
            this.isShow = false;
            this.details = res['data']['data'];
            this.isShow = true;
            this.modalService.open(this.content, ModalOptions);
            this.msg = this.pastDetails.data.displayMessage;
            // this.d();
          }
          //  else {
          //   this.details = res['data']['data'];
          //   this.isShow = true;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.data.displayMessage;
          // }
          // //  error popup
          // if (this.pastDetails.previousOffer.data.length > 0) {
          //   this.isShow = false;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.previousOffer.displayMessage;
          // };
          // //  info popup
          // if (this.pastDetails.data.data.length > 0) {
          //   this.details = res['data']['data'];
          //   this.isShow = true;
          //   this.modalService.open(this.content, ModalOptions);
          //   this.msg = this.pastDetails.data.displayMessage;
          // };
        }
      });

    } else {
      if (this.form.value.email.length > 0) {
        this.form.controls['email'].setValidators(
          [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
        );
      } else {
        this.form.controls['email'].setValidators([Validators.required]);
      }
      this.form.controls['email'].updateValueAndValidity();
    }


    // this.service.email_exists({ 'email': this.form.value.email }).subscribe(res => {
    //   console.log('res=>', res);

    // }, (err) => {
    //   console.log('err=>', err);

    //   this.form.controls['email'].setErrors({ 'isExist': true });
    // });
    // if (this.form.value.email.length > 0) {
    // this.form.controls['email'].setValidators(
    //   [Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
    // );
    // } else {
    //   this.form.controls['email'].setValidators([Validators.required]);
    // }
    // this.form.controls['email'].updateValueAndValidity();

    // this.service.add_offer_pastOffer({ 'email': email }).subscribe(res => {
    //   this.pastDetails = res[`data`][`data`];
    //   if (this.pastDetails.length > 0) {
    //     this.modalService.open(this.content, ModalOptions);
    //   }
    // });
  }
  next(e) {
    this.modalService.dismissAll(this.content);
    this.modalService.open(this.content1, ModalOptions);
    this.err_msg = this.pastDetails.previousOffer.displayMessage;
  }
  send() {
    if (this.pastDetails.ReleasedOffer.data.length > 0) {
      if (this.userDetail.role === 'employer') {
        this.modalService.dismissAll(this.content1);
        this.router.navigate(['/employer/offers/list']);
      } else if (this.userDetail.role === 'sub-employer') {
        this.modalService.dismissAll(this.content1);
        this.router.navigate(['/sub_employer/offers/list']);
      }
    } else {
      this.modalService.dismissAll(this.content1);
    }
  }

  // key up event for email
  findEmail(value) {
    console.log('find email=======>');
    for (let index = 0; index < this.candidate.length; index++) {
      const element = this.candidate[index];
      if (value.target.value.toLowerCase() === element.user.email) {
        this.display_msg = true;
        this.form.controls.candidate_name.setValue(element.firstname + ' ' + element.lastname);
        document.getElementById('candidate_name').setAttribute('disabled', 'true');
        break;
      } else {
        this.display_msg = false;
        this.form.controls.candidate_name.setValue('');
        document.getElementById('candidate_name').removeAttribute('disabled');
      }
    }
  }

  // get location
  getLocation() {
    const promise = new Promise((resolve, reject) => {
      this.service.get_locations().subscribe(
        async res => {
          // this.location = await res[`data`].data;
          // this.locationList.push(res[`data`].data)
          if (res[`data`].data) {
            res[`data`].data.forEach(element => {
              this.locationList.push({ label: element.city, value: element._id });
            });
          }
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
      this.disabled = false;
      this.form.controls['salaryduration'].setValidators([Validators.required, Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      // if (this.form.value.salaryduration.length > 0) {
      this.form.controls['salaryduration'].setValidators([Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);
      // }
      // this.form.controls['salaryduration'].updateValueAndValidity();
    } else {
      this.disabled = true;
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
          this.customFieldList();
        })
        .then(res => {
          if (this.route.snapshot.data.title !== 'Edit' && this.route.snapshot.data.title !== 'View') {
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
    } else if (this.userDetail.role === 'candidate' || this.userDetail.role === 'admin') {
      this.spinner.hide();
      this.getDetail();
    }
  }
  // getDetail
  getDetail() {
    this.spinner.show();
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      this.service.offer_detail(this.id).subscribe((res) => {
          if (res[`data`]){
            this.spinner.hide();
            if(this.is_View){
              if (!(res['data'].status === 'Accepted')) {
                  res[`data`].offertype = (this.offer_type_optoins.find(o => o.value === res[`data`].offertype).label);
              }
              if (res[`data`][`AdHoc`].length > 0) {
                res[`data`][`AdHoc`].forEach(element => {
                  element.AdHoc_trigger = (this.Trigger_Option.find(o => o.value === element.AdHoc_trigger).label);
                });
              }
              if (res[`data`][`communication`].length > 0) {
                this.isSetCommunication = true;
                res[`data`][`communication`].forEach(element => {
                  $('#editor').summernote('disable');
                  element.trigger =
                    (this.Trigger_Option.find(o => o.value === element.trigger).label);
                });
                // res[`data`][`communication`][0].trigger =
                //   (this.Trigger_Option.find(o => o.value === res[`data`][`communication`][0].trigger).label);
              } else {
                this.isSetCommunication = false;
              }

            } else if (this.is_Edit){
              if (res['data'].status === 'Accepted') {
                
                // this.default_date = res[`data`][`joiningdate`];
                console.log('res[`data`].expirydate=>', res[`data`].expirydate);
                this.max_date = new Date(res[`data`].expirydate);
                console.log('max_date=>', this.max_date);
                
                // this.form.controls['salarybracket'].setErrors(null);
                this.isAccepted = true;
                this.form.controls['title'].disable();
                if (res[`data`][`salary`]) {
                  // this.form.controls['salarybracket'].disable();
                  document.getElementById('salarybracket').setAttribute('disabled', 'true');
                } else if (res[`data`][`salary_from`] && res[`data`][`salary_to`]){
                  // this.form.controls['salarybracket_from'].disable();
                  // this.form.controls['salarybracket_to'].disable();
                  document.getElementById('salarybracket_from').setAttribute('disabled', 'true');
                  document.getElementById('salarybracket_to').setAttribute('disabled', 'true');
                }
                this.disabled = true;
                this.form.controls['offertype'].disable();
                this.form.controls['notes'].disable();
                document.getElementById('annual').setAttribute('disabled', 'true');
                document.getElementById('hourly').setAttribute('disabled', 'true');
                // this.updateValidation();
              }

                // set communication
                if (res['data']['communication'] && res['data']['communication'].length > 0) {
                  this.isSetCommunication = true;
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
                    }));
                    _communication_array.push(new_communication);
                  });
                  this.communicationData = _communication_array;

                } else {
                  this.isSetCommunication = false;
                }
                // set communication

                // set AdHoc
                if (res['data']['AdHoc'] && res['data']['AdHoc'].length > 0) {
                  this.AdHocCommunicationData = res['data']['AdHoc'];
                  const _Adhoc_communication_array = [];
                  this.AdHocCommunicationData.forEach((element, index) => {
                    const new_communication = {
                      'AdHoc_communicationname': element.AdHoc_communicationname,
                      'AdHoc_trigger': element.AdHoc_trigger,
                      'AdHoc_priority': element.AdHoc_priority,
                      'AdHoc_day': element.AdHoc_day,
                      'AdHoc_message': element.AdHoc_message,
                    };
                    this.AdHocCommunication.setControl(index, this.fb.group({
                      AdHoc_communicationname: ['', Validators.required],
                      AdHoc_trigger: ['', Validators.required],
                      AdHoc_priority: ['', Validators.required],
                      AdHoc_day: ['', Validators.required],
                      AdHoc_message: ['', Validators.required]
                    }));
                    _Adhoc_communication_array.push(new_communication);
                  });
                  this.AdHocCommunicationData = _Adhoc_communication_array;
                } else {
                  let index = 1;
                  this.AdHocCommunication.setControl(index, this.fb.group({
                    AdHoc_communicationname: [''],
                    AdHoc_trigger: [''],
                    AdHoc_priority: [''],
                    AdHoc_day: [''],
                    AdHoc_message: ['']
                  }));
                }
                // set AdHoc
                this.form.controls['email'].setValue(res[`data`].user_id.email);
                this.form.controls['candidate_name'].setValue(
                  res[`candidate_data`]['data'].firstname + ' ' + res[`candidate_data`]['data'].lastname
                );
                this.form.controls['title'].setValue(res[`data`].title);
                this.form.controls.salarytype.setValue(res['data'].salarytype);
                this.form.controls['salaryduration'].setValue(res[`data`].salaryduration);
                this.form.controls['location'].setValue(res[`data`]['location'][`_id`]);
                this.form.controls['expirydate'].setValue(new Date(res[`data`].expirydate));
                this.form.controls['joiningdate'].setValue(new Date(res[`data`].joiningdate));
                this.form.controls['offertype'].setValue(res[`data`].offertype);
                if (res['data'].acceptedAt) {
                  this.form.controls['acceptanceDate'].setValue(moment(new Date(res['data'].acceptedAt)).format('DD/MM/YYYY'));
                } else {
                  this.form.controls['acceptanceDate'].setValue('Date of Offer Acceptance');
                }// this.form.controls['acceptanceDate'].setValue(res['data'].acceptedAt);
                this.form.controls['notes'].setValue(res[`data`].notes);
                this.form.controls['offerStatus']
                  .setValue({ label: `${res[`data`][`status`]}`, value: `${res[`data`][`status`]}` });
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
                // if (res['data'].groups) {
                //   this.form.controls['group'].setValue(res[`data`]['groups']);
                //   this.form.controls['high_unopened'].setValue(res[`data`].high_unopened);
                //   this.form.controls['high_notreplied'].setValue(res[`data`].high_notreplied);
                //   this.form.controls['medium_unopened'].setValue(res[`data`].medium_unopened);
                //   this.form.controls['medium_notreplied'].setValue(res[`data`].medium_notreplied);
                // }
                const _array = [];
                const test = res[`data`]['customfeild'];
                this.service.get_customfield().subscribe(
                  resp => {
                    this.customfield = resp['data'];
                    this.customfield.forEach((element, index) => {
                      const value = test.find(c => c.key === element.key) ?
                        test.find(c => c.key === element.key).value : '';
                      const new_customfield = {
                        key: element.key,
                        value,
                      };
                      this.customfieldItem.setControl(
                        index,
                        this.fb.group({
                          value: [value, [this.noWhitespaceValidatorForNotRequired]],
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
                  });
            }
          }
          this.resData = res[`data`];
          this.candidateData = res['candidate_data']['data'];
          this.grpId = this.resData.user_id;
          this.socketService.joinGrp(this.resData.user_id);
          this.service.status(this.resData.status).subscribe(resp => {
            this.offerStatus = resp['status'];
          });
          this.spinner.hide();
          this.groupDetail(res[`data`].groups);
        });
    } else if (this.userDetail.role === 'candidate') {



      this.service.offer_detail_candidate(this.id).subscribe((res) => {
          this.spinner.hide();
          this.resData = res[`data`][0];
          // this.resData.offertype = (this.offer_type_optoins.find(o => o.value === this.resData.offertype).label);
          const d = new Date();
          d.setDate(d.getDate() - 1);
          if (this.resData.status && d > new Date(this.resData.expirydate)) {
            this.isExpired = true;
          } else {
            this.isExpired = false;
          }

          if (this.resData.created_by.username) {
            this.userName = this.resData.created_by.username;
          } else {
            this.userName = this.resData.employer_id.employer.username;
          }
          this.spinner.hide();
          this.is_View = true;
          this.resData = res[`data`][0];
        });



    } else if (this.userDetail.role === 'admin') {



      //  do code here for admin side - offer detail
      this.adminService.offer_detail_admin(this.id).subscribe((res) => {
          this.spinner.hide();
          // res[`data`].offertype = (this.offer_type_optoins.find(o => o.value === res[`data`].offertype).label);
          if (res[`data`][`AdHoc`].length > 0) {

            res[`data`][`AdHoc`].forEach(element => {
              element.AdHoc_trigger = (this.Trigger_Option.find(o => o.value === element.AdHoc_trigger).label);
            });

          }
          if (res[`data`][`communication`].length > 0) {
            res[`data`][`communication`].forEach(element => {
              element.trigger =
                (this.Trigger_Option.find(o => o.value === element.trigger).label);

            });
            // res[`data`][`communication`][0].trigger =
            //   (this.Trigger_Option.find(o => o.value === res[`data`][`communication`][0].trigger).label);
          }
          this.resData = res[`data`];
          this.candidateData = res['candidate_data']['data'];
          this.spinner.hide();
          this.is_View = true;
          this.resData.groupName = res['data']['groups']['name'];
          this.groupDetail(res[`data`].groups);
        });




    }
  }

  // get candidate details
  async getCandidateList() {
    const promise = new Promise((resolve, reject) => {
      this.service.get_candidate_list().subscribe(
        async res => {
          this.candidate = await res['data'];
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

  // get customField list
  async customFieldList() {
    this.service.get_customfield().subscribe(
      res => {
        this.customfield = res['data'];
        const _array = [];
        this.customfield.forEach((element, index) => {
          const new_customfield = {
            key: element.key,
            value: '',
          };
          this.customfieldItem.setControl(
            index,
            this.fb.group({
              value: ['', [this.noWhitespaceValidatorForNotRequired]],
              key: [element.key],
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
    this.service.get_groups().subscribe(res => {
      console.log('res=>', res);
      if (res[`data`].data) {
        res[`data`].data.forEach(element => {
          this.group_optoins.push({ label: element.name, value: element._id });
        });
      }
    },
      err => {
        console.log(err);
      }
    );
  }

  async groupDetail(id) {
    if (!(this.userDetail.role === 'admin')) {
      const groupById = this.group_optoins.find(x => x.value === id);
      if (groupById) {
        this.form.controls.group.setValue(groupById.value);
        if (this.is_View &&
          !(this.resData.high_notreplied || this.resData.high_unopened || this.resData.medium_notreplied || this.resData.medium_unopened)) {
          this.getGroupDetails = false;
        } else if (this.group_optoins.value === '') {
          this.getGroupDetails = false;
        }
        else {
          this.getGroupDetails = true;
        }
        this.setGroupFormControl();

        this.groupData.high_unopened = this.resData.high_unopened;
        this.groupData.high_notreplied = this.resData.high_notreplied;
        this.groupData.medium_unopened = this.resData.medium_unopened;
        this.groupData.medium_notreplied = this.resData.medium_notreplied;

      }
      if (groupById && this.is_View) {
        this.resData.groupName = groupById.label;
      }
    } else {
      if (this.is_View &&
        !(this.resData.high_notreplied || this.resData.high_unopened || this.resData.medium_notreplied || this.resData.medium_unopened)) {
        this.getGroupDetails = false;
      } else {
        this.getGroupDetails = true;
      }
    }

  }

  //  set controls for group form
  setGroupFormControl() {
    this.form.setControl('high_unopened', new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]));
    this.form.setControl('high_notreplied', new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]));
    this.form.setControl('medium_unopened', new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]));
    this.form.setControl('medium_notreplied', new FormControl('', [Validators.pattern(/^[0-9]\d*$/)]));
    this.form.updateValueAndValidity();
  }

  // On change of group
  groupChange(e) {
    console.log('e.value=>', e.value);
    console.log('this.form=>', this.form.controls.communicationFieldItems['controls']);
    if (e.value) {
      this.Groupservice.get_detail(e.value).subscribe(res => {
        this.getGroupDetails = true;
        this.isSetCommunication = true;
        this.setGroupFormControl();
        // this.form.setControl('high_unopened', new FormControl('', [Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]));
        // this.form.setControl('high_notreplied', new FormControl('', [Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]));
        // this.form.setControl('medium_unopened', new FormControl('', [Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]));
        // this.form.setControl('medium_notreplied', new FormControl('', [Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]));

        this.groupData = res['data']['data'][0];
        if (res['communication']['data'] && res['communication']['data'].length > 0) {
          this.communicationData = res['communication']['data'][0]['communication'];
        }

        // set communication
        if (this.communicationData && this.communicationData.length > 0) {
          this.is_communication_added = true;
          const _array = [];
          this.communicationData.forEach((element, index) => {
            const new_communication = {
              'communicationname': element.communicationname,
              'trigger': element.trigger,
              'priority': element.priority,
              'day': element.day,
              'message': element.message,
            };
            this.communicationFieldItems.setControl(index, this.fb.group({
              communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
              trigger: ['', Validators.required],
              priority: ['', Validators.required],
              day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
              message: ['', [Validators.required, this.noWhitespaceValidator]]
              // message: ['', Validators.required]
            }));
            _array.push(new_communication);
          });
          this.communicationData = _array;

          // this.form.updateValueAndValidity();
        } else {
          console.log('no communicaiondata found => ');
          // if (this.Comm_Flag) {

          this.add_new_communication();
          // }
        }
        // set communication
        // this.getGroupDetails = false;
      }, (err) => {
        this.getGroupDetails = false;
        this.isSetCommunication = false;
      });
      console.log('if value ===>this.form=>', this.form.controls);

    } else {
      this.getGroupDetails = false;
      this.isSetCommunication = false;
      console.log('else => no value => this.form=>', this.form.controls);
      console.log(' this.communicationFieldItems=>', this.communicationFieldItems['controls']);
      // this.communicationFieldItems['controls'].forEach(element => {
      //   console.log('element=>', element);
      //   element['controls'].setValidators(null);
      // });
      // this.updateValidation();
      // this.form.controls.communicationFieldItems.reset();
      // this.communicationFieldItems.removeAt
    }
  }

  Accept(id, type) {
    // this.accept_btn = true;
    this.show_spinner = true;
    // type = (this.offer_type_optoins.find(o => o.label === this.resData.offertype).value);
    this.service.type_message({ 'type': type }).subscribe(res => {
      if (type === 'noCommit') {
        this.isNoCommit = true;
        this.Info_msg = res[`data`][`message`];
        this.modalService.open(this.content2, ModalOptions);
      } else {
        this.isNoCommit = false;
        this.Info_msg = res[`data`][`message`];
        console.log('this.Info_msg=>', this.Info_msg);
        this.modalService.open(this.content2, ModalOptions);

      }
      this.OfferID = id;
    });
    // this.service.offer_accept(obj).subscribe(res => {
    //   if (res['data'].status === 1) {
    //     this.spinner.show();
    //     Swal.fire(
    //       {
    //         type: 'success',
    //         text: res['message']
    //       }
    //     );
    //     this.spinner.hide();

    //   }
    //   this.router.navigate(['/candidate/offers/list']);
    // });
  }

  acceptOffer(e) {
    if (this.selectedValue === 'accept') {
      this.isAccept = true;
    } else {
      this.isAccept = false;
    }
  }
  acceptedOffer() {
    this.modalService.dismissAll(this.content1);
    this.service.offer_accept({ 'id': this.OfferID }).subscribe(res => {
      // this.accept_btn = true;
      this.show_spinner = true;
      const routee = this.router;
      Swal.fire(
        {
          type: 'success',
          text: res['message']
        }
      ).then(function (isConfirm) {
        if (isConfirm) {
          routee.navigate(['/candidate/offers/list']);
        }
      });
      this.show_spinner = false;
    });
    
  }
  disabledAccept() {
    this.show_spinner = false;

    // document.getElementById('accept').setAttribute('disabled', 'false');
  }

  // get joining date
  // getJoiningDate(e) {
  //   const date = new Date(e);
  //   const month = date.getMonth() + 1;
  //   this.joiningdate = date.getFullYear() + '-' + month + '-' + date.getDate();
  //   this.min_expiry_date = this.form.value.joiningdate;
  // }

  getExpiryDate(e) {
    // if ((this.resData !== 'Accepted')){
      const date = new Date(e);
      const month = date.getMonth() + 1;
      this.expirydate = date.getFullYear() + '-' + month + '-' + date.getDate();
      this.max_date = this.form.value.expirydate;
      console.log('this.max_date=>', this.form.value.expirydate);
    // }
  }

  // add more communication
  addMoreCommunication() {
    // this.is_disabled_btn = true;

    this.add_new_AdHoc_communication();
    //  $('#summernote').summernote();


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
      communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      message: ['', [Validators.required, this.noWhitespaceValidator]]
    }));
    this.communicationData.push(new_communication);
    this.updateValidation();
  }

  // Add AdHoc Communication
  add_new_AdHoc_communication(data_index = null) {
    let index = 0;
    if (data_index == null) {
      if (this.AdHocCommunicationData && this.AdHocCommunicationData.length > 0) {
        index = this.AdHocCommunicationData.length;
      } else {
        this.AdHocCommunicationData = [];
      }
    } else {
      if (this.AdHocCommunicationData && this.AdHocCommunicationData.length > 0) {
        index = this.AdHocCommunicationData.length;
      }
    }
    const new_communication = {
      'AdHoc_communicationname': '',
      'AdHoc_trigger': '',
      'AdHoc_priority': '',
      'AdHoc_day': '',
      'AdHoc_message': '',
    };

    this.AdHocCommunication.setControl(index, this.fb.group({
      AdHoc_communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
      AdHoc_trigger: ['', Validators.required],
      AdHoc_priority: ['', Validators.required],
      AdHoc_day: ['', [Validators.required, Validators.pattern(/^[0-9]\d*$/)]],
      AdHoc_message: ['', [Validators.required, this.noWhitespaceValidator]]
    }));
    this.AdHocCommunicationData.push(new_communication);
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

  // Remove AdHOC
  remove_AdHoc_communication(index: number) {
    delete this.AdHocCommunicationData[index];
    this.AdHocCommunication.removeAt(index);
    const array = [];
    for (let i = 0; i < this.AdHocCommunicationData.length; i++) {
      if (this.AdHocCommunicationData[i] !== undefined) {
        array.push(this.AdHocCommunicationData[i]);
      }
    }
    this.AdHocCommunicationData = array;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  // blur event for salary input
  onSalaryBlur() {
    if (this.form.value.salarybracket > 0) {
      this.form.controls['salarybracket'].setValue(parseFloat(this.form.value.salarybracket));
      this.form.controls['salarybracket'].setValidators([Validators.required, Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]);

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
      this.form.controls['salarybracket_from'].setValidators(
        [Validators.required, Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.form.controls['salarybracket_to'].setValidators(
        [Validators.required, Validators.pattern(/^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/)]
      );
      this.form.controls['salarybracket_from'].setValue(parseFloat(this.form.value.salarybracket_from));
      this.form.controls['salarybracket_to'].setValue(parseFloat(this.form.value.salarybracket_to));
      document.getElementById('salarybracket').setAttribute('disabled', 'true');
      this.form.controls['salarybracket'].setErrors(null);
      this.updateValidation();
    } else {
      document.getElementById('salarybracket').removeAttribute('disabled');
      // this.form.controls['salarybracket'].setErrors(Validators.required);
    }
  }

  cancel() {
    if (this.userDetail.role === 'employer') {
      if (!this.is_View) {
        this.confirmationService.confirm({
          message: 'Are you sure you want to cancel?',
          accept: () => {
            this.show_spinner = true;
            this.router.navigate([this.cancel_link]);
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      } else {
        this.router.navigate([this.cancel_link]);
      }

    } else if (this.userDetail.role === 'sub-employer') {
      if (!this.is_View) {
        this.confirmationService.confirm({
          message: 'Are you sure you want to cancel?',
          accept: () => {
            this.show_spinner = true;
            this.router.navigate([this.cancel_link1]);
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      } else {
        this.router.navigate([this.cancel_link1]);
      }
    } else if (this.userDetail.role === 'candidate') {
      this.router.navigate(['/candidate/offers/list']);
    } else if (this.userDetail.role === 'admin') {
      const backID = this.route.snapshot.params.report_id;
      this.router.navigate(['/admin/employers/approved_employer/report/' + backID + '/list']);
    }
  }

  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  noWhitespaceValidatorForNotRequired(control: FormControl) {
    if (control.value.length > 0) {
      if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { '_whitespace': true };
      }
    }
  }

  checkFrom(from, to) {
    this.from = parseInt(from.target.value, 10);
    this.to = parseInt(to, 10);
    if (this.from > this.to) {
      this.error = true;
      this.err_from = 'Salary From can\'t be greater than Salary To';
      this.err_to = 'Salary To can\'t be lesser than Salary From.';
    } else if (this.from === this.to) {
      this.error = true;
      this.err_from = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }

  checkTo(from, to) {
    this.to = parseInt(from.target.value, 10);
    this.from = parseInt(to, 10);
    if (this.from > this.to) {
      this.error = true;
      this.err_from = 'Salary From can\'t be greater than Salary To';
      this.err_to = 'Salary To can\'t be lesser than Salary From.';
    } else if (this.from === this.to) {
      this.error = true;
      this.err_from = 'Can\'t be same!';
      this.err_to = 'Can\'t be same!';
    } else {
      this.error = false;
    }
  }

  // getCursor = (e) => {
  //   const selection = document.getSelection();
  //   this.cursorPos = selection.anchorOffset;
  // }

  append(value) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  removeZero_high_unopened() {
    if (this.form.value.high_unopened && this.form.value.high_unopened >= 0) {
      this.form.controls['high_unopened'].setValue(parseFloat(this.form.value[`high_unopened`]));
    }
  }
  removeZero_high_notreplied() {
    if (this.form.value.high_notreplied && this.form.value.high_notreplied >= 0) {
      this.form.controls['high_notreplied'].setValue(parseFloat(this.form.value[`high_notreplied`]));
    }
  }
  removeZero_medium_unopened() {
    if (this.form.value.medium_unopened && this.form.value.medium_unopened >= 0) {
      this.form.controls['medium_unopened'].setValue(parseFloat(this.form.value[`medium_unopened`]));
    }
  }
  removeZero_medium_notreplied() {
    if (this.form.value.medium_notreplied && this.form.value.medium_notreplied >= 0) {
      this.form.controls['medium_notreplied'].setValue(parseFloat(this.form.value[`medium_notreplied`]));
    }
  }


  // submit offers
  onSubmit(flag) {
    console.log('this.form.value.group=>', this.form);
    this.is_submitted = true;
    // customised fields
    const _coustomisedFieldsArray = [];
    this.form.value.customfieldItem.forEach(element => {
      _coustomisedFieldsArray.push({
        key: element.key,
        value: element.value
      });
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

    // AdHoc Communication 
    const AdHOc_communication_array = [];
    if (this.AdHocCommunicationData.length > 0) {
      this.AdHocCommunicationData.forEach(element => {
        AdHOc_communication_array.push({
          AdHoc_communicationname: element.AdHoc_communicationname,
          AdHoc_trigger: element.AdHoc_trigger,
          AdHoc_priority: element.AdHoc_priority,
          AdHoc_day: element.AdHoc_day,
          AdHoc_message: element.AdHoc_message
          // AdHoc_message: element.AdHoc_message
        });
      });
    } else {
      AdHOc_communication_array.push();
    }
    this.formData = new FormData();
    const unwantedFields = [
      'candidate',
      'customfieldItem',
      'group',
      'offerStatus',
      'status',
      'employer_id',
      'communicationFieldItems',
      'AdHocCommunication',
      'salarybracket',
      'salarybracket_from',
      'salarybracket_to',
    ];

    const form_data = {
      ...this.form.value,
      location: this.form.value.location,
      expirydate: this.commonService.current_time_to_UTC(this.form.value.expirydate),
      joiningdate: this.commonService.current_time_to_UTC(this.form.value.joiningdate),
      salary: this.form.value.salarybracket ? this.form.value.salarybracket : '',
      salary_from: this.form.value.salarybracket_from ? this.form.value.salarybracket_from : '',
      salary_to: this.form.value.salarybracket_to ? this.form.value.salarybracket_to : '',
      customfeild: JSON.stringify(_coustomisedFieldsArray),
      data: JSON.stringify(communication_array),
      AdHoc: JSON.stringify(AdHOc_communication_array),
      medium_notreplied: this.form.value.medium_notreplied || this.form.value.medium_notreplied == 0 ? this.form.value.medium_notreplied : '',
      medium_unopened: this.form.value.medium_unopened || this.form.value.medium_unopened == 0 ? this.form.value.medium_unopened : '',
      high_notreplied: this.form.value.high_notreplied || this.form.value.high_notreplied == 0 ? this.form.value.high_notreplied : '',
      high_unopened: this.form.value.high_unopened || this.form.value.high_unopened == 0 ? this.form.value.high_unopened : '',
    };
    Object.keys(form_data).map(key => {
      if (unwantedFields.includes(key)) {
        delete form_data[key];
      }
    });

    for (const key in form_data) {
      if (key) {
        const value = form_data[key];
        this.formData.append(key, value);
      }
    }
    if (this.form.value.group && this.route.snapshot.data.title === 'Add') {
      console.log('this.form.value.group=>', this.form.value);
      this.formData.append('groups', this.form.value.group);
    } else if (this.route.snapshot.data.title === 'Edit') {
      this.formData.append('groups', this.form.value.group !== undefined && this.form.value.group !== null &&
        this.form.value.group !== '' ? this.form.value.group : '');
    }

    if (flag) {
      this.show_spinner = true;
      if (this.route.snapshot.data.title === 'Edit') {

        this.formData.append('id', this.id);
        this.formData.append('status', this.form.value.offerStatus.value);
        this.confirmationService.confirm({
          message: 'Are you sure that you want to Update this Offer?',
          accept: () => {
            this.service.update_offer(this.formData).subscribe(
              res => {
                this.socketService.changeOffer(this.grpId);
                this.socketService.leaveGrp(this.grpId);
                this.socketService.joinGrp(res['data']['data'].employer_id);
                this.socketService.changeOffer(res['data']['data'].employer_id);
                this.socketService.leaveGrp(res['data']['data'].employer_id);
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
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      } else {
        if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
          this.confirmationService.confirm({
            message: 'Are you sure that you want to Add this Offer?',
            accept: () => {
              this.show_spinner = true;
              this.service.add_offer(this.formData).subscribe(
                res => {
                  this.socketService.joinGrp(res['data']['data'].user_id);
                  this.socketService.changeOffer(res['data']['data'].user_id);
                  this.socketService.leaveGrp(res['data']['data'].user_id);
                  this.socketService.joinGrp(res['data']['data'].employer_id);
                  this.socketService.changeOffer(res['data']['data'].employer_id);
                  this.socketService.leaveGrp(res['data']['data'].employer_id);
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
            }, reject: () => {
              this.show_spinner = false;
            }
          });
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

  ngOnDestroy(): void {
    this.socketService.leaveGrp(this.grpId);
  }

}
