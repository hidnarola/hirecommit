import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss']
})
export class EmployerDetailComponent implements OnInit {
  approval: boolean =  false;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  cancel() {
    this.router.navigate(['admin/employer_manage/view']);
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }
}
