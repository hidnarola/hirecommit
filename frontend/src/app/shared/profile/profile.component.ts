import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { EmployerService } from '../../views/employer/employer.service';
import { CandidateService } from '../../views/shared-components/candidates/candidate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  image = environment.imageUrl;
  userType: any;
  alldata: any = [];
  countryList: any = [];
  profileForm: FormGroup;
  obj: any;
  obj1: any;
  Business_Type: any = [];
  businessCode: any;
  constructor(private service: CommonService,
    private router: ActivatedRoute,
    public fb: FormBuilder,
    private Employerservice: EmployerService,
    private CandidateService: CandidateService,
    private tostsr: ToastrService,
    private route: Router) {

    // console.log('this.router.snapshot.data.type => ', this.router.snapshot.data.type);
    // if (this.router.snapshot.data.type === 'candidate') {
    //   this.userType = 'Candidate';

    this.userType = localStorage.getItem('user');
    // console.log('get user from local storage => ', this.userType);
    this.profileForm = this.fb.group({
      country: new FormControl('', [Validators.required])
    })

    // }
  }

  ngOnInit() {
    if (this.userType !== 'admin') {
      this.service.getprofileDetail.subscribe(async res => {
        if (res) {
          this.profileData = res;
          console.log('from profile +>>', this.profileData);
        } else {
          const profile = await this.service.decrypt(localStorage.getItem('profile'));
          console.log('profile==>', profile);

          if (profile) {
            this.profileData = JSON.parse(profile);
            console.log('profileData==>', this.profileData);
            this.businessType(this.profileData.country)
          } else {
            console.log('profile data not found');
          }
        }
      });
    }
    else {
      console.log('it is admin!');
    }


  }
  edit(id) {

    this.obj = {
      'id': id,
      'username': this.profileData.username,
      'website': this.profileData.website,
      'email': this.profileData.email,
      'companyname': this.profileData.companyname,
      'businesstype': this.businessCode,
      'contactno': this.profileData.contactno
    }
    this.Employerservice.update_Profile(this.obj).subscribe(res => {
      console.log('edited!!', res);
      this.tostsr.success(res['message'], 'Success!', { timeOut: 3000 });
    })
  }
  candidate_profile(id) {
    this.obj1 = {
      'id': id,
      'firstname': this.profileData.firstname,
      'lastname': this.profileData.lastname,
      'email': this.profileData.email,
      'contactno': this.profileData.contactno,

    }
    this.CandidateService.update_Profile_candidate(this.obj1).subscribe(res => {
      console.log('edited', res);

      this.tostsr.success(res['message'], 'Success!', { timeOut: 3000 })
    })
  }

  businessType(id) {
    if (this.profileData) {
      this.Business_Type = [];
      this.service.get_Type(id).subscribe(res => {
        res['data'].forEach(element => {
          this.Business_Type.push({ 'label': element.name, 'value': element._id });
        });
      })
    }
  }
  value(event) {
    console.log('value', event.value);
    this.businessCode = event.value

  }

  cancel() {
    this.route.navigate(['/employer/offers/list'])
  }

  cancel1() {
    this.route.navigate(['/candidate/offers/list'])
  }
}
