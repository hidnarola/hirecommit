import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  userType: any;
  constructor(private service: CommonService, private router: ActivatedRoute) {

    // console.log('this.router.snapshot.data.type => ', this.router.snapshot.data.type);
    // if (this.router.snapshot.data.type === 'candidate') {
    //   this.userType = 'Candidate';

    this.userType = localStorage.getItem('user');
    console.log('get user from local storage => ', this.userType);

    // }
  }

  ngOnInit() {
    console.log('user>>', localStorage.getItem['user']);

    this.service.getprofileDetail.subscribe(async res => {
      if (res) {
        this.profileData = res;
      } else {
        const profile = await this.service.decrypt(localStorage.getItem('profile'));
        console.log('profile==>', profile);

        if (profile) {
          this.profileData = JSON.parse(profile);
          console.log("profileData==>", this.profileData);
        } else {
          console.log('profile data not found');
        }
      }
    });

  }

}
