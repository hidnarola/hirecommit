import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newcandidate-list',
  templateUrl: './newcandidate-list.component.html',
  styleUrls: ['./newcandidate-list.component.scss']
})
export class NewcandidateListComponent implements OnInit {

  constructor() { }

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

}
