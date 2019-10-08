import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {
  location: any;
  loc: any;
 id: any;
 group: any;
 salary: any;
  offers: any;
  displayForm = false;
  constructor(private router: Router, private service: OfferService, private route: ActivatedRoute
             ) { }

  ngOnInit() {
     this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.offer_detail(this.id).subscribe(res => {
      this.offers = res['data'];
    });
  }

  checkValue(e) {
    console.log(e);
  }

  edit(id) {
    this.router.navigate(['/employer/manage_offer/addoffer/' + id]);
  }
  cancel( ) {
    this.router.navigate(['/employer/manage_offer/created_offerlist']) ;
  }
  details(gid) {
    this.router.navigate(['/employer/manage_group/group_details/' + gid]);
  }

}
