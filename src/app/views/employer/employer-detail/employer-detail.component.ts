import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss']
})
export class EmployerDetailComponent implements OnInit {
  id: any;
  employerDetail: any = [];
  approval: boolean =  false;
  constructor(public service: EmployerService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employerDetail =  res;
    });
  }

  cancel() {
    this.router.navigate(['/employer/view']);
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }
}
