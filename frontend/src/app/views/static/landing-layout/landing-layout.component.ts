import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss']
})
export class LandingLayoutComponent implements OnInit {
  isEmployer: Boolean = false;
  isCandidate: Boolean = false;
  hostName: any = '';
  isProd: Boolean = false;

  constructor() {
    this.isProd = environment.production;
    console.log('window.location.hostname => ', window.location.hostname);
    this.hostName = window.location.hostname;
    if (this.hostName === 'employer.hirecommit.com') {
      this.isEmployer = true;
    } else if (this.hostName === 'candidate.hirecommit.com') {
      this.isCandidate = true;
    } else {
      // if (this.isProd) {
      //   window.location.href = 'http://candidate.hirecommit.com/';
      // }
    }
    // else if (this.hostName === 'candidate.hirecommit.com') {
    //   this.isCandidate = true;
    // }
  }

  ngOnInit() {
  }

}
