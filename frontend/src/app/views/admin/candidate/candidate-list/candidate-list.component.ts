import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit, OnDestroy {

  constructor(private router: Router) { }
  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();
  ngOnInit() {
    // this.dtTrigger.next();
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };
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

  ngOnDestroy = () => {
    // this.dtTrigger.unsubscribe();
  }
  onDetail(){
    this.router.navigate(['/admin/candidate_manage/candidate_detail']);
  }
}
