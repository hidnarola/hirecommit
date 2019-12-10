import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-candidate-landing',
  templateUrl: './candidate-landing.component.html',
  styleUrls: ['./candidate-landing.component.scss']
})
export class CandidateLandingComponent implements OnInit {
  current_url = '';

  constructor(private location: Location, ) { }

  ngOnInit() {
    this.current_url = this.location.path();
  }

}
