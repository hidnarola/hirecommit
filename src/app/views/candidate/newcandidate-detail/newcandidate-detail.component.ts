import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newcandidate-detail',
  templateUrl: './newcandidate-detail.component.html',
  styleUrls: ['./newcandidate-detail.component.scss']
})
export class NewcandidateDetailComponent implements OnInit {
  approval: boolean = false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }

  cancel() {
    this.router.navigate(['/candidate/newcandidate']);
  }

}
