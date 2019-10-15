import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss']
})
export class EmployerDetailComponent implements OnInit {

  id: any;
  employer_detail: any;
  name: any = [];
  form = false;
  buttonValue: any;
  buttonValue1: String;
  constructor(private router: Router, private service: EmployerService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })

    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employer_detail = res['data'];
      this.form = true;
      if (this.employer_detail.user_id.isAllow === false) {
        this.buttonValue = 'Approve'
        this.buttonValue1 = 'unapprove'
      }
      else {

        this.buttonValue1 = 'Cancel'
      }
      console.log('details >>', this.employer_detail);

      this.name = this.employer_detail.username.split(' ');
      console.log('name >>', this.name);

    })
  }

  onApproved(id) {
    this.service.aprroved_employer(id).subscribe(res => {
      console.log("approved!!!", res);
      this.router.navigate(['/admin/employers/view']);
    })
  }

  onUnapproved(id) {
    console.log(id);

    this.service.deactivate_employer(id).subscribe(res => {
      console.log("Deleted!!");
      this.router.navigate(['admin/employers/list']);
    })

  }


  check(routes) {
    if (routes === false) {
      this.router.navigate(['admin/employers/list']);

    }
    else {
      this.router.navigate(['/admin/employers/view']);

    }
  }


}
