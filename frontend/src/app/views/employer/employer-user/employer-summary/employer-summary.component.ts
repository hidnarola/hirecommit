import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from '../offer.service';



@Component({
  selector: 'app-employer-summary',
  templateUrl: './employer-summary.component.html',
  styleUrls: ['./employer-summary.component.scss']
})
export class EmployerSummaryComponent implements OnInit {
  deactive: any;
  offers: any[];
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
    console.log("ID", id);this.router.navigate(['/employer/manage_offer/offerdetail/' + id]);
  }

  edit(id) {
    console.log("edit ID", id);
    this.router.navigate(['/employer/manage_offer/editoffer/' + id]);
  }

  delete(id) {
    console.log('deleet',id);
    
    this.service.deactivate_offer(id).subscribe(res => {
      res= id;
      this.deactive = res;
      console.log(this.deactive);
      this.bind();})
  }

  onAdd() {
    this.router.navigate(['/employeruser/addoffer']);
  }

  public bind(){
    this.service.view_offer()
      .subscribe(res => {
        
        console.log("deactivate", res);
        this.offers = res['data'];
        this.offers = this.offers.filter(x => x.is_del === false);
        console.log('deactivate', this.offers);

      })
  }

}
