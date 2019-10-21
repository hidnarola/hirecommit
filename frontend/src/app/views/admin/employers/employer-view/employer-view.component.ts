import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-employer-view',
  templateUrl: './employer-view.component.html',
  styleUrls: ['./employer-view.component.scss']
})
export class EmployerViewComponent implements OnInit {

  id: any;
  employer_detail: any;
  name: any = [];
  buttonValue: any;
  buttonValue1: String;
  cancel_link = '/admin/employers/list';

  constructor(
    private router: Router,
    private service: EmployerService,
    private route: ActivatedRoute
  ) {
    console.log('employer view component  => ');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employer_detail = res['data'];
      if (this.employer_detail.user_id.isAllow === false) {
        this.buttonValue = 'Approve';
        this.buttonValue1 = 'unapprove';
      } else {
        this.buttonValue1 = 'Cancel';
      }
      this.name = this.employer_detail.username.split(' ');
    });
  }

  onApproved(id) {
    this.service.aprroved_employer(id).subscribe(res => {
      this.router.navigate(['/admin/employers/view']);
    });
  }

  onUnapproved(id) {
    this.service.deactivate_employer(id).subscribe(res => {
      this.router.navigate([this.cancel_link]);
    });
  }

  check(routes) {
    if (routes === false) {
      this.router.navigate([this.cancel_link]);
    } else {
      this.router.navigate(['/admin/employers/view']);
    }
  }

}
