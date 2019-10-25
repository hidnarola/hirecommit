import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
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
  constructor(private service: CommonService,
    private router: ActivatedRoute,
    public fb: FormBuilder, ) {

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
          } else {
            console.log('profile data not found');
          }
        }
      });
    } else {
      console.log('it is admin!');

    }

    this.service.country_registration().subscribe(res => {
      this.alldata = res['data'];
      console.log('Profile country>', res['data']);
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country, 'value': element._id });
      });
    });
  }

}
