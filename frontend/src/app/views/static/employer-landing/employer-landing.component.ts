import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employer-landing',
  templateUrl: './employer-landing.component.html',
  styleUrls: ['./employer-landing.component.scss']
})
export class EmployerLandingComponent implements OnInit {
  current_url = '';

  constructor(private location: Location, ) { }

  ngOnInit() {
    this.current_url = this.location.path();
  }


}
