import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newcandidate-detail',
  templateUrl: './newcandidate-detail.component.html',
  styleUrls: ['./newcandidate-detail.component.scss']
})
export class NewcandidateDetailComponent implements OnInit {
  approval: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }

  cancel() {
  }

}
