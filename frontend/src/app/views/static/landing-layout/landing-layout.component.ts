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
  is_Stagging_Employer: boolean = false;
  is_Stagging_Candidate: boolean = false;
  hostName: any = '';
  isProd: Boolean = false;
  isStaging: Boolean = false;

  constructor(public router: Router) {
    this.isProd = environment.production;
    this.isStaging = environment.staging;
    this.hostName = window.location.hostname;
    // if (this.hostName === 'candidate.hirecommit.com') {
    if (this.hostName === 'employer.hirecommit.com' || this.hostName === 'employer.tanubhasin.com') {
      this.isEmployer = true;
    } else if (this.hostName === 'candidate.hirecommit.com' || this.hostName === 'candidate.tanubhasin.com') {
      this.isCandidate = true;
    } else {
      if (this.isProd || this.isStaging) {
        window.location.href = environment.candidateURL;
      } else {
        this.router.navigate(['/login']);
      }
    }
    // else if (this.hostName === 'candidate.hirecommit.com') {
    //   this.isCandidate = true;
    // }
    // } else {
    //   if (this.hostName === 'employer.tanubhasin.com') {
    //     this.isEmployer = true;
    //   } else if (this.hostName === 'candidate.tanubhasin.com') {
    //     this.isCandidate = true;
    //   } else {
    //     if (this.isProd) {
    //       window.location.href = 'http://candidate.tanubhasin.com/';
    //     } else {
    //       this.router.navigate(['/login']);
    //     }
    //   }
    //   // else if (this.hostName === 'candidate.hirecommit.com') {
    //   //   this.isCandidate = true;
    //   // }
    // }
  }

  ngOnInit() {
  }

}

//

//
