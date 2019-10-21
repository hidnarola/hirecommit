import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileData: any = {};
  constructor(private service: CommonService) { }

  ngOnInit() {
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
