import { Component, OnInit } from '@angular/core';
import { OfferListService } from '../offerList.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerlist',
  templateUrl: './offerlist.component.html',
  styleUrls: ['./offerlist.component.scss']
})
export class OfferlistComponent implements OnInit {
employer: any;
  offerList: any;

  constructor(private service:OfferListService,private route: Router) { }

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


  onDelete(id){
    this.service.deactivate_offer(id).subscribe(res => {
      console.log("deactivate offer",res);
      this.bind();
    })
  }

  public bind(){
         this.service.view_offerList().subscribe(res => {
           this.offerList = res['data']['data'];
           console.log("candidate offer list", this.offerList);
           this.offerList = this.offerList.filter(x => x.is_del === false);

           console.log('eid', this.offerList.employer_id);

           this.service.get_employer(this.offerList.employer_id).subscribe(res => {
             this.employer = res['data']['data'];
             console.log('emp data', this.employer);

           })
         })

  }

}
