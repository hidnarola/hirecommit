import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployerService } from '../../employer.service';

@Component({
  selector: 'app-employer-summary',
  templateUrl: './employer-summary.component.html',
  styleUrls: ['./employer-summary.component.scss']
})
export class EmployerSummaryComponent implements OnInit {
offers: any[];
  constructor(private router: Router, private service: EmployerService) { }

  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

  this.service.view_offer()
  .subscribe(res => {
    console.log("Offers",res);
    this.offers = res[('data')];
  })

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

  detail() {
   this.router.navigate(['/employer/manage_offer/offerdetail']);
  }

  edit() {
   this.router.navigate(['/employer/manage_offer/addoffer']);
  }

  delete() {}

  onAdd() {
    this.router.navigate(['/employeruser/addoffer']);
  }

}
