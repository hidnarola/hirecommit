import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-bussiness-detail',
  templateUrl: './bussiness-detail.component.html',
  styleUrls: ['./bussiness-detail.component.scss']
})
export class BussinessDetailComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  onNext(){
     this.router.navigate(['/businessDeatil1']);
  }
}
