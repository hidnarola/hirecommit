import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-layout',
  templateUrl: './landing-layout.component.html',
  styleUrls: ['./landing-layout.component.scss']
})
export class LandingLayoutComponent implements OnInit {
  isEmployer: Boolean = false;
  isCandidate: Boolean = false;
  hostName: any = '';

  constructor() {
    console.log('window.location.hostname => ', window.location.hostname);
    this.hostName = window.location.hostname;
    if (this.hostName === 'employer.hirecommit.com') {
      this.isEmployer = true;
    } else if (this.hostName === 'candidate.hirecommit.com') {
      this.isCandidate = true;
    }
  }

  ngOnInit() {
  }

}
