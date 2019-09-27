import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryBracketService } from '../manag-salary-bracket.service';

@Component({
  selector: 'app-view-salarybracket',
  templateUrl: './view-salarybracket.component.html',
  styleUrls: ['./view-salarybracket.component.scss']
})
export class ViewSalarybracketComponent implements OnInit {
  salary_brcakets: any;
  deactive: any;
  constructor(private router: Router, private service: SalaryBracketService) { }
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
  detail() {
    // this.router.navigate(['/groups/summarydetail']);
  }

  edit() {
    this.router.navigate(['/employer/manage_salarybracket/add_salarybracket']);
  }

  delete(id) {

    this.service.deactivate_salary_brcaket(id).subscribe(res => {
         res= id;
      this.deactive = res;
      console.log(this.deactive);
     
      console.log("salary delete",res);
      this.bind();
       
    })
  }

  onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
  }

  public bind(){
    this.service.view_salary_brcaket().subscribe(res => {
      this.salary_brcakets = res['data'];
      this.salary_brcakets = this.salary_brcakets.filter(x => x.is_del === false )
      console.log("salary", this.salary_brcakets);


     

    })

  }
}
