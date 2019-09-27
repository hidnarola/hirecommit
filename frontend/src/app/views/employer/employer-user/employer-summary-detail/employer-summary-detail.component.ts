import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {
  form = FormGroup;
  data: any;
  details: any = [];
  id: number;
  all_details: any = [];
  constructor(private router: Router ,private route: ActivatedRoute,private service: OfferService) { }

  ngOnInit() {
    let sub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    })

    this.service.offer_detail(this.id).subscribe(res => {
      // console.log(res);
      this.details = res['data'];
      console.log("details",this.details);
    })
  }

  edit() {
    this.router.navigate(['/employer/manage_offer/addoffer']);
  }
  cancel( ) {
    this.router.navigate(['/employer/manage_offer/created_offerlist']) ;
  }

}
