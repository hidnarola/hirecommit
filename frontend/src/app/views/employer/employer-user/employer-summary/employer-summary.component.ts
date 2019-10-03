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
  offers: any=[];
  date: any;
  group:any;
  salary: any;
  constructor(private router: Router, private service: OfferService) { }

  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });

    //group

    this.service.get_groups().subscribe(res => {
      this.group = res['data']['data'];

      this.group = this.group.filter(x => x._id === this.offers.group);
      console.log(this.group);
    })

    //salary

    this.service.get_salary_brcaket().subscribe(res => {
      this.salary = res['data']['data'];
      this.salary = this.salary.filter(x => x._id === this.offers.salarybracket);
      console.log(this.salary);

    })
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

  edit(id) {
    this.router.navigate(['/employer/manage_offer/addoffer/' + id]);
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
   var user_id = localStorage.getItem('userid')
    console.log("user_id",user_id);
    
    this.router.navigate(['/employer/manage_offer/addoffer/' + user_id]);
  }

  public bind() {
    this.service.view_offer()
      .subscribe(res => {
        this.offers = res['data']['data'];
        this.offers = this.offers.filter(x => x.is_del === false);

        this.offers.filter(x => {
          this.date = x.createdAt.split("T");
        });
        
      })
  }

}
