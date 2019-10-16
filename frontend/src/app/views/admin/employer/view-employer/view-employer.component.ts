import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-view-employer',
  templateUrl: './view-employer.component.html',
  styleUrls: ['./view-employer.component.scss']
})
export class ViewEmployerComponent implements OnInit {

  clicked = false;
  employer: any = [];
  name: any = [];
  data: any;

  constructor(
    private router: Router,
    private service: EmployerService
  ) {
    console.log('admin- employer: view-employer component => ');
  }

  ngOnInit(): void {
    // const table = $('#example').DataTable({
    //   drawCallback: () => {
    //     $('.paginate_button.next').on('click', () => {
    //         this.nextButtonClickEvent();
    //       });
    //   }
    // });
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

  delete(id) {
    this.service.deactivate_employer(id).subscribe(res => {
      this.bind();
    });
  }

  getEmployerlist() { }

  detail(id) {
    this.router.navigate(['admin/employers/detail/' + id]);
  }

  public bind() {
    this.service.getemployer().subscribe(res => {
      this.employer = res['data'];
      this.employer = this.employer.filter(x => x.user_id.isAllow === true);

    });
  }

}
