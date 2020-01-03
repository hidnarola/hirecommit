import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-candidate-landing',
  templateUrl: './candidate-landing.component.html',
  styleUrls: ['./candidate-landing.component.scss']
})
export class CandidateLandingComponent implements OnInit {
  current_url = '';
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  constructor(private location: Location, ) {
    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
  }

  ngOnInit() {
    this.current_url = this.location.path();
  }

}
