import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  current_url = '';

  constructor(
    private location: Location,
  ) { }

  ngOnInit() {
    this.current_url = this.location.path();
  }

}
