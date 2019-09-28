import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {
 id : any;
  offers: any;
  constructor(private router: Router,private service: OfferService,private route: ActivatedRoute
             ) { }

  ngOnInit() {
    let sub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    })

    this.service.offer_detail(this.id).subscribe(res => {

      this.offers = res['data']['data'];
      console.log("detail",this.offers);
    })
  }

  edit() {
    this.router.navigate(['/employer/manage_offer/addoffer']);
  }
  cancel( ) {
    this.router.navigate(['/employer/manage_offer/created_offerlist']) ;
  }

}
