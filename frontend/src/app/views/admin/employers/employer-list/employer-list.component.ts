import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-list',
  templateUrl: './employer-list.component.html',
  styleUrls: ['./employer-list.component.scss']
})
export class EmployerListComponent implements OnInit {

  employer: any = [];
  name: any;
  data: any;

  constructor(
    private router: Router,
    private service: EmployerService
  ) { }

  ngOnInit() {
    this.service.getemployer().subscribe(res => {
      this.employer = res['data'];
      this.employer = this.employer.filter(x => x.user_id.isAllow === false);
    });
  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    // do next particular records like  101 - 200 rows.
    // we are calling to api
    console.log('next clicked');
  }

  previousButtonClickEvent(): void {
    // do previous particular the records like  0 - 100 rows.
    // we are calling to API
  }

  aprrov(id) {
    this.service.aprroved_employer(id).subscribe(res => { });
  }

  getEmployerlist() { }

  detail(id) {
    this.router.navigate(['admin/employers/detail/' + id]);
  }

  delete(id) {
    this.service.deactivate_employer(id).subscribe(res => { });
  }

}
