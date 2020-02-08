import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { EmployerService } from '../../views/employer/employer.service';
import { CandidateService } from '../../views/shared-components/candidates/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  submitted = false;
  ProfileDetail: any;
  profileData: any = {};
  image = environment.imageUrl;
  profileForm: FormGroup;
  CandidateForm: FormGroup;
  obj: any;
  obj1: any;
  CompanyName: any;
  Website: any;
  Email: any;
  Country: any;
  BusinessType: any;
  UserName: any;
  CountryCode: any;
  ContactNumber: any;
  FirstName: any;
  LastName: any;
  Candidate_ContactNo: any;
  Candidate_Email: any;
  Candidate_Country: any;
  Candidate_CountryCode: any;
  DocumentType: any;
  DocumentNumber: any;
  DrivingLicenseState: any;
  DocumentImage: any;
  id: any;
  emp_data: any;
  candidate_data: any;
  Business_Type: any = [];
  businessCode: any;
  show_spinner = false;
  userDetail: any = [];
  _profile_data: any;
  isProd: Boolean = false;
  isStaging: Boolean = false;
  currentUrl = '';
  constructor(
    private service: CommonService,
    private router: ActivatedRoute,
    public fb: FormBuilder,
    private Employerservice: EmployerService,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private route: Router,
    private confirmationService: ConfirmationService,
    private commonService: CommonService) {
    this.currentUrl = this.route.url;

    this.isProd = environment.production;
    this.isStaging = environment.staging;
    this.userDetail = this.service.getLoggedUserDetail();
    this.id = {
      'id': this.userDetail.id
    };

    this.service.profileData().then(res => {
      this._profile_data = res[0];
    });
    this.employerForm();
    this.candidateForm();

  }

  employerForm = () => {
    this.profileForm = new FormGroup({
      companyname: new FormControl(''),
      website: new FormControl(''),
      country: new FormControl(''),
      bussinesstype: new FormControl(''),
      countrycode: new FormControl(''),
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      contactno: new FormControl('', Validators.compose([Validators.required,
      Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
      ])),
    });
  }

  candidateForm = () => {
    this.CandidateForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      lastname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      candidatecountry: new FormControl(''),
      documenttype: new FormControl(''),
      documentimage: new FormControl(),
      documentNumber: new FormControl(),
      drivingLicenseState: new FormControl(),
      candidate_countrycode: new FormControl(''),
      candidate_email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      candidate_contactno: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
        ])),
    });
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }
  ngOnInit() {
    if (this.userDetail.role === 'employer') {
      // this.commonService.getuserdata.subscribe(res => {
      //   // console.log('res from emp profile=>', res);

      //   this.emp_data = res;
      //   this.employerForm();
      this.getEmploterData().then((resp: any) => {
        // console.log('resp from profile getdeatil=>', resp);

        // setTimeout(() => {
        //   if (resp && res.companyname) {
        //     // console.log(' if in details=>', res);
        //     const userID = res['id'];
        //     this.CompanyName = res['companyname'];
        //     this.Website = res['website'];
        //     this.Email = res['email'];
        //     this.Country = res['country'];
        //     this.BusinessType = res['bussinesstype'];
        //     this.UserName = res['username'];
        //     this.CountryCode = res['countrycode'];
        //     this.ContactNumber = res['contactno'];

        //     this.obj = {
        //       'id': userID,
        //       'username': this.UserName,
        //       'email': this.Email,
        //       'contactno': this.ContactNumber
        //     };

        //   } else if (resp) {
        // console.log('else in details=======>');
        this.emp_data = resp;
        this.CompanyName = resp['companyname'];
        this.Website = resp['website'];
        this.Email = resp['email'];
        this.Country = resp['country'];
        this.BusinessType = resp['businesstype'];
        this.UserName = resp['username'];
        this.CountryCode = resp['countrycode'];
        this.ContactNumber = resp['contactno'];
        //     }
        //   }, 300);

        // });

      });
    } else if (this.userDetail.role === 'candidate') {
      // this.commonService.getuserdata.subscribe(res => {
      //   console.log('res=>', res);

      //   this.emp_data = res;
      //   this.candidateForm();
      this.getCandidate().then((resp: any) => {
        //     console.log('resp=>', resp);

        //     setTimeout(() => {
        //       if (resp && res.firstname) {
        //         this.candidate_data = res;
        //         this.FirstName = res['firstname'];
        //         this.LastName = res['lastname'];
        //         this.Candidate_Email = res['email'];
        //         this.Candidate_Country = res['country'];
        //         this.DocumentType = res['documenttype'];
        //         this.DocumentNumber = res['documentNumber'] ? res['documentNumber'] : '-';
        //         this.DrivingLicenseState = res['drivingLicenseState'];
        //         this.DocumentImage = res['documentimage'][0];
        //         this.Candidate_ContactNo = res['contactno'];
        //         this.Candidate_CountryCode = res['countrycode'];

        //       }
        //       else if (resp) {

        this.candidate_data = resp;
        this.FirstName = resp['firstname'];
        this.LastName = resp['lastname'];
        this.Candidate_Email = resp['email'];
        this.Candidate_Country = resp['country'];
        this.DocumentType = resp['documenttype'];
        this.DocumentNumber = resp['documentNumber'] ? resp['documentNumber'] : '-';
        this.DrivingLicenseState = resp['drivingLicenseState'];
        this.DocumentImage = resp['documentimage'][0];
        this.Candidate_ContactNo = resp['contactno'];
        this.Candidate_CountryCode = resp['countrycode'];
        //     }
        //   }, 300);

        // });

      });
    }

  }

  async getEmploterData() {
    return new Promise((pass, fail) => {
      this.Employerservice.get_profile(this.id).subscribe(async res => {
        pass(res[`data`]);
      }, err => {
        fail(err);
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });

      });
    });
  }

  async getCandidate() {
    return new Promise((pass, fail) => {
      this.candidateService.get_Profile_Candidate(this.id).subscribe(res => {

        pass(res[`data`]);
      }, err => {
        fail(err);
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    });
  }

  edit(valid, id) {
    this.submitted = true;
    if (valid) {
      this.show_spinner = true;
      this.obj = {
        'id': id,
        'username': this.UserName,
        'email': this.Email,
        'contactno': this.ContactNumber
      };
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update your Profile?',
        accept: () => {
          this.show_spinner = false;

          this.Employerservice.update_Profile(this.obj).subscribe(res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.commonService.changedProfileDetail(true);
            this.getEmploterData();
            if (this.userDetail.email !== this.Email.toLowerCase()) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userid');
              localStorage.clear();
              // localStorage.removeItem('user');
              if (this.isProd || this.isStaging) {
                if (this.userDetail.role === 'employer') {
                  window.location.href = environment.employerURL;
                } else if (this.userDetail.role === 'sub-employer') {
                  window.location.href = environment.employerURL;
                } else if (this.userDetail.role === 'candidate') {
                  window.location.href = environment.candidateURL;
                } else if (this.userDetail.role === 'admin') {
                  window.location.href = environment.mainURL + '/login';
                }
              } else {
                this.route.navigate(['/login']);
              }
            } else {
              console.log('else=>');

            }
          },
            err => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            }
          );
        }, reject: () => {
          this.show_spinner = false;
        }
      });
    }

  }

  candidate_profile(valid, id) {
    this.submitted = true;
    if (valid) {
      this.show_spinner = true;
      this.obj1 = {
        'id': id,
        'firstname': this.FirstName,
        'lastname': this.LastName,
        'email': this.Candidate_Email,
        'contactno': this.Candidate_ContactNo,

      };
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update your Profile?',
        accept: () => {
          this.show_spinner = false;
          this.candidateService.update_Profile_candidate(this.obj1).subscribe(res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.commonService.changedProfileDetail(true);
            this.getCandidate();
            if (this.userDetail.email !== this.Candidate_Email.toLowerCase()) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userid');
              localStorage.clear();
              // localStorage.removeItem('user');
              if (this.isProd || this.isStaging) {
                if (this.userDetail.role === 'employer') {
                  window.location.href = environment.employerURL;
                } else if (this.userDetail.role === 'sub-employer') {
                  window.location.href = environment.employerURL;
                } else if (this.userDetail.role === 'candidate') {
                  window.location.href = environment.candidateURL;
                } else if (this.userDetail.role === 'admin') {
                  window.location.href = environment.mainURL + '/login';
                }
              } else {
                this.route.navigate(['/login']);
              }
            } else {
              console.log('else=>');
            }
          },
            err => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            }
          );
        }, reject: () => {
          this.show_spinner = false;
        }
      });
    }
    this.show_spinner = false;

  }


  // businessType(id) {
  //   if (this.profileData) {
  //     this.Business_Type = [];
  //     this.service.get_Type(id).subscribe(res => {

  //       res['data'].forEach(element => {
  //         this.Business_Type.push({ 'label': element.name, 'value': element._id });
  //       });
  //       console.log('this.Business_Type=>', this.Business_Type);

  //     });
  //   }
  // }
  value(event) {
    this.businessCode = event.value;
  }

  cancel() {
    this.route.navigate(['/employer/offers/list']);
  }

  cancel1() {
    if (this._profile_data.user_id.email_verified) {
      this.route.navigate(['/candidate/offers/list']);
    } else {
      this.route.navigate(['/candidate/account_verification']);
    }
  }

  checkEmail() {
    if (this.userDetail.role === 'employer') {
      this.service.email_exists({ 'email': this.profileForm.value.email, 'user_id': this.emp_data.user_id._id }).subscribe(res => {
      }, (err) => {
        this.profileForm.controls['email'].setErrors({ 'isExist': true });
        this.profileForm.updateValueAndValidity();
      });
    } else if (this.userDetail.role === 'candidate') {
      this.service.email_exists({
        'email': this.CandidateForm.value.candidate_email, 'user_id': this.candidate_data.user_id
      }).subscribe(res => { }, (err) => {
        this.CandidateForm.controls['candidate_email'].setErrors({ 'isExist': true });
        this.CandidateForm.updateValueAndValidity();
      });
    }

  }

  ngOnDestroy(): void {
    // if (this.userDetail.role === 'employer') {
    //   if (!this.submitted) {
    //     this.ProfileDetail = this.profileForm.value;

    //     let obj = {
    //       'id': this.emp_data.user_id._id,
    //       'username': this.ProfileDetail.username,
    //       'companyname': this.ProfileDetail.companyname,
    //       'website': this.ProfileDetail.website,
    //       'country': this.ProfileDetail.country,
    //       'bussinesstype': this.ProfileDetail.bussinesstype,
    //       'countrycode': this.ProfileDetail.countrycode,
    //       'email': this.ProfileDetail.email,
    //       'contactno': this.ProfileDetail.contactno,
    //     }
    //     if ((this.ProfileDetail.email !== '' && this.ProfileDetail.email !== undefined) ||
    //       (this.ProfileDetail.username !== '' && this.ProfileDetail.email !== undefined) ||
    //       (this.ProfileDetail.contactno !== '' && this.ProfileDetail.contactno !== undefined)) {
    //       console.log('this.ProfileDetail=>', this.ProfileDetail);

    //       this.commonService.setuserData(obj);
    //       this.route.navigate([this.currentUrl]);
    //       this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.route.url });

    //     }
    //   } else {
    //     this.commonService.setuserData('');
    //   }
    // }
    // else if (this.userDetail.role === 'candidate') {
    //   if (!this.submitted) {
    //     this.ProfileDetail = this.CandidateForm.value;
    //     console.log('this profileData=>', this.ProfileDetail);
    //     let obj = {

    //       'FirstName': this.ProfileDetail['firstname'],
    //       'LastName': this.ProfileDetail['lastname'],
    //       'Candidate_Email': this.ProfileDetail['email'],
    //       'Candidate_Country': this.ProfileDetail['country'],
    //       'DocumentType': this.ProfileDetail['documenttype'],
    //       'DocumentNumber': this.ProfileDetail['documentNumber'],
    //       'DrivingLicenseState': this.ProfileDetail['drivingLicenseState'],
    //       'DocumentImage': this.ProfileDetail['documentimage'][0],
    //       'Candidate_ContactNo': this.ProfileDetail['contactno'],
    //       'Candidate_CountryCode': this.ProfileDetail['countrycode'],
    //     }
    //     if (this.ProfileDetail.email !== '' && this.ProfileDetail.firstname !== '' && this.ProfileDetail.lastname !== '' && this.ProfileDetail.contactno !== '') {
    //       this.commonService.setuserData(obj);
    //       console.log('obj=>', obj);
    //       this.route.navigate([this.currentUrl]);
    //       this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.route.url });

    //     }
    //   }
    // }
  }
}

