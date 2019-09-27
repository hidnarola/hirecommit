import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups-details',
  templateUrl: './groups-details.component.html',
  styleUrls: ['./groups-details.component.scss']
})
export class GroupsDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['/employer/manage_group/view_group']);
  }

  edit () {
    this.router.navigate(['/employer/manage_group/add_group']);
  }

  onclick() {

  }

}
