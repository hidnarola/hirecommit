import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployerService } from '../employer.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-view-employer',
  templateUrl: './view-employer.component.html',
  styleUrls: ['./view-employer.component.scss']
})
export class ViewEmployerComponent implements OnInit, OnDestroy  {
  name = 'Angular';
  employer: any = [];
  constructor(public service: EmployerService, private router: Router) {}
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    // this.dtTrigger.next();
    // const table = $('#example').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });

    this.service.employerList.subscribe(response => {
      this.getEmployerlist();
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

  delete(id) {
    this.service.delemployer(id).subscribe(res => {
      console.log('Record Deleted');
      this.service.checkHere();
    });
  }
  getEmployerlist() {
    this.service.getemployer().subscribe(res => {
      this.employer = res;
      this.dtTrigger.next();
    });
  }

  detail(id) {
    this.router.navigate(['/employer/detail/' + id]);
  }

  edit(id) {
    this.router.navigate(['/employer/edit/' + id]);
  }

  ngOnDestroy = () => {
    this.dtTrigger.unsubscribe();
  }
}
