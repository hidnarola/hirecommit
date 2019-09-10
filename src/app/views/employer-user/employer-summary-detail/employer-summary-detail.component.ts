import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-summary-detail',
  templateUrl: './employer-summary-detail.component.html',
  styleUrls: ['./employer-summary-detail.component.scss']
})
export class EmployerSummaryDetailComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  edit(){
    this.router.navigate(['/employeruser/addoffer'])
  }

cancel(){
  this.router.navigate(['/employeruser/summary']);;;
}

}
