import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { EmployerService } from '../../views/employer/employer.service';
import { CandidateService } from '../../views/shared-components/candidates/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { AnimationKeyframesSequenceMetadata } from '@angular/animations';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  submitted = false;
  profileData: any = {};
  image = environment.imageUrl;
  profileForm: FormGroup;
  CandidateForm: FormGroup;
  obj: any;
  obj1: any;
  CompanyName: any;
  Website: any
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
  DocumentImage: any;
  id: any;
  emp_data: any;
  candidate_data: any;
  Business_Type: any = [];
  businessCode: any;
  show_spinner = false;
  userDetail: any = [];
  constructor(
    private service: CommonService,
    private router: ActivatedRoute,
    public fb: FormBuilder,
    private Employerservice: EmployerService,
    private candidateService: CandidateService,
    private tostsr: ToastrService,
    private route: Router,
    private confirmationService: ConfirmationService, ) {
    this.userDetail = this.service.getLoggedUserDetail();
    console.log('this,userDetail.profile=>', this.userDetail);
    this.id = {
      'id': this.userDetail.id
    }
    this.profileForm = new FormGroup({
      companyname: new FormControl(''),
      website: new FormControl(''),
      country: new FormControl(''),
      bussinesstype: new FormControl(''),
      countrycode: new FormControl(''),
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      contactno: new FormControl('', Validators.compose([Validators.required,
      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      Validators.maxLength(10), Validators.minLength(10)
      ])),
    });

    this.CandidateForm = new FormGroup({
      firstname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      lastname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      candidatecountry: new FormControl(''),
      documenttype: new FormControl(''),
      documentimage: new FormControl(),
      candidate_countrycode: new FormControl(''),
      candidate_email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      candidate_contactno: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.maxLength(10), Validators.minLength(10)
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
    // if (this.userType !== 'admin') {
    //   this.service.getprofileDetail.subscribe(async res => {
    //     if (res) {
    //       this.profileData = res;
    //     } else {
    //       const profile = await this.service.decrypt(localStorage.getItem('profile'));
    //       if (profile) {
    //         this.profileData = JSON.parse(profile);

    //         this.businessType(this.profileData.country);
    //       } else {
    //         console.log('profile data not found');
    //       }
    //     }
    //   });
    // } else {
    //   console.log('it is admin!');
    // }

    //employer get details
    if (this.userDetail.role === 'employer') {
      this.getEmploterData();
    }
    else if (this.userDetail.role === 'candidate') {
      this.getCandidate();
    }

  }

  getEmploterData() {
    this.Employerservice.get_profile(this.id).subscribe(res => {
      this.emp_data = res['data']
      this.CompanyName = res['data']['companyname'];
      this.Website = res['data']['website'];
      this.Email = res['data']['email']
      this.Country = res['data']['country']
      this.BusinessType = res['data']['businesstype']
      this.UserName = res['data']['username']
      this.CountryCode = res['data']['countrycode']
      this.ContactNumber = res['data']['contactno']
      console.log('res=>', this.emp_data);
    })
  }

  getCandidate() {
    this.candidateService.get_Profile_Candidate(this.id).subscribe(res => {
      console.log('res=> ', res['data']['documentimage'][0]);
      this.candidate_data = res['data']
      this.FirstName = res['data']['firstname'];
      this.LastName = res['data']['lastname'];
      this.Candidate_Email = res['data']['email'];
      this.Candidate_Country = res['data']['country'];
      this.DocumentType = res['data']['documenttype'];
      this.DocumentImage = res['data']['documentimage'][0];
      this.Candidate_ContactNo = res['data']['contactno'];
      this.Candidate_CountryCode = res['data']['countrycode'];
    })
  }

  edit(valid, id) {
    this.submitted = true;
    console.log('id=>', id);
    if (valid) {
      this.show_spinner = true;
      this.obj = {
        'id': id,
        'username': this.UserName,
        'email': this.Email,
        'contactno': this.ContactNumber
      };
      console.log('this.obj=> ', this.obj);

      this.confirmationService.confirm({
        message: 'Are you sure that you want to update your Profile?',
        accept: () => {
          this.show_spinner = false;
          this.Employerservice.update_Profile(this.obj).subscribe(res => {
            this.tostsr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.getEmploterData();
            if (this.userDetail.email != this.Email) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userid');
              localStorage.clear();
              // localStorage.removeItem('user');
              this.route.navigate(['/login']);
            } else {
              console.log('else=>');

            }
          },
            err => {
              this.show_spinner = false;
              this.tostsr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            }
          );
        }
      });
    } this.show_spinner = false;

  }

  candidate_profile(valid, id) {
    this.submitted = true;
    console.log('id=>', id);
    console.log('valid=>', valid);
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
            this.tostsr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.getCandidate();
            if (this.userDetail.email != this.Candidate_Email) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('userid');
              localStorage.clear();
              // localStorage.removeItem('user');
              this.route.navigate(['/login']);
            } else {
              console.log('else=>');

            }
          },
            err => {
              this.show_spinner = false;
              this.tostsr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            }
          );
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
    this.route.navigate(['/candidate/offers/list']);
  }
}
