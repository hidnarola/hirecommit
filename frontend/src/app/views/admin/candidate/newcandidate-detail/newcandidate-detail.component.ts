import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newcandidate-detail',
  templateUrl: './newcandidate-detail.component.html',
  styleUrls: ['./newcandidate-detail.component.scss']
})
export class NewcandidateDetailComponent implements OnInit {
  approval: boolean = false;
  cancel_link = '/admin/candidates/new_candidate';

  constructor(
    private router: Router
  ) {
    console.log('admin- candidate: newcandidate - detail component => ');
  }

  ngOnInit() { }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }

}
