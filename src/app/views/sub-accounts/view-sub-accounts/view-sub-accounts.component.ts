import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-sub-accounts',
  templateUrl: './view-sub-accounts.component.html',
  styleUrls: ['./view-sub-accounts.component.scss']
})
export class ViewSubAccountsComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

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
    // this.router.navigate(['/groups/summarydetail']);
   }
 
   edit() {
    // this.router.navigate(['/groups/addgroup']);
   }
 
   delete() {}
 
   onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
   }
}