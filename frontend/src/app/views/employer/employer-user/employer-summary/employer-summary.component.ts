import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployerService } from '../../employer.service';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary',
  templateUrl: './employer-summary.component.html',
  styleUrls: ['./employer-summary.component.scss']
})
export class EmployerSummaryComponent implements OnInit {
  offers: any[];
  date: any;
  constructor(private router: Router, private service: OfferService) { }

  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });

    this.bind();

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

  detail(id) {
    this.router.navigate(['/employer/manage_offer/offerdetail/' + id]);
  }

  edit() {
    this.router.navigate(['/employer/manage_offer/addoffer']);
  }

  delete(id) {
    this.service.deactivate_offer(id).subscribe(res => {
        // this.offers = res['data'];
        console.log('res',res);
        
        // console.log("deactivate",this.offers);
        this.bind();
    })
   }

  onAdd() {
    this.router.navigate(['/employeruser/addoffer']);
  }

  public bind() {
    this.service.view_offer()
      .subscribe(res => {
        // this.offers = res['data'];
        this.offers = res['data'].filter(x => x.is_del === false);
        this.offers.filter(x => {
          this.date = x.createdAt.split("T");
        });
        
      })
  }

}
