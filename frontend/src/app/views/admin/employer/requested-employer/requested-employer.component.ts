import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployerService } from '../employer.service';
@Component({
  selector: 'app-requested-employer',
  templateUrl: './requested-employer.component.html',
  styleUrls: ['./requested-employer.component.scss']
})
export class RequestedEmployerComponent implements OnInit {

  employer: any = [];
  name: any;
  data: any;

  constructor(
    private router: Router,
    private service: EmployerService
  ) {
    console.log('admin- employer: requested-employer component => ');
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

  aprrov(id) {
    console.log('approved!!', id);
    this.service.aprroved_employer(id).subscribe(res => {
      this.bind();
      //  this.router.navigate(['/admin/employers/view']);
    });
  }

  getEmployerlist() { }

  detail(id) {
    this.router.navigate(['admin/employers/detail/' + id]);
  }

  delete(id) {
    console.log(id);
    this.service.deactivate_employer(id).subscribe(res => {
      console.log('Deleted!!');
      this.bind();
    });
  }

  public bind() {
    this.service.getemployer().subscribe(res => {
      this.employer = res['data'];
      console.log('emp data >>', this.employer[0].username);
      this.employer = this.employer.filter(x => x.user_id.isAllow === false);
    });
  }

}
