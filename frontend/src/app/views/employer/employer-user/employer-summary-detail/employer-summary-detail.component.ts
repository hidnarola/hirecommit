import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {
  location:any;
  loc:any;
 id : any;
 group: any;
 salary: any;
  offers: any;
  displayForm = false;
  constructor(private router: Router,private service: OfferService,private route: ActivatedRoute
             ) { }

  ngOnInit() {
     this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    })

    this.service.offer_detail(this.id).subscribe(res => {

      this.offers = res['data']['data'];
     
      console.log("detail duration", this.offers);

      //location
      this.service.get_location().subscribe(res => {
        this.location = res['data']['data'];
        this.loc = this.location.filter(x => x._id === this.offers.location);
      })

      //group

      this.service.get_groups().subscribe(res => {
          this.group =res['data']['data'];
          
          this.group = this.group.filter(x => x._id === this.offers.group);
          console.log(this.group);
      })

      //salary

      this.service.get_salary_brcaket().subscribe(res => {
        this.salary = res['data']['data'];
        this.displayForm = true;
        this.salary = this.salary.filter(x => x._id === this.offers.salarybracket);
        console.log(this.salary);
        
      })

    })
  }


  edit(id) {
    this.router.navigate(['/employer/manage_offer/addoffer/' + id]);
  }
  cancel( ) {
    this.router.navigate(['/employer/manage_offer/created_offerlist']) ;
  }
  details(gid){
    this.router.navigate(['/employer/manage_group/group_details/' + gid]);
  }

}
