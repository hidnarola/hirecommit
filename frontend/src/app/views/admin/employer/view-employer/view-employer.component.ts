import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-view-employer',
  templateUrl: './view-employer.component.html',
  styleUrls: ['./view-employer.component.scss']
})
export class ViewEmployerComponent implements OnInit  {
  employer: any[];
  constructor(private router: Router, private service: EmployerService) {}
  ngOnInit(): void {
    // const table = $('#example').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });

    // this.service.getemployer().subscribe(res => {
    //   console.log("View Employer",res);

    //   this.employer =res;
    // })
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

  delete() {
  }

  getEmployerlist() {
  }

  detail() {
    this.router.navigate(['admin/employer_manage/detail']);
  }

  edit() {
    this.router.navigate(['admin/employer_manage/edit/']);
  }
}
