import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {
  id: any;
  offers: any;
  Disable = true;
  display = false;
  constructor(private router: Router, private service: OfferService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.offer_detail(this.id).subscribe(res => {
      this.offers = res['data'];
      this.display = true;
      console.log(this.offers);
      if (this.offers['salarytype'] === 'hourly') {
        this.Disable = false;
      }
    });
  }

  checkValue(e) {
    console.log(e);
  }

  edit(id) {
    this.router.navigate(['/employer/offers/add/' + id]);
  }
  cancel() {
    this.router.navigate(['/employer/offers/list']);
  }
  details(gid) {
    this.router.navigate(['/employer/groups/group_details/' + gid]);
  }



}
