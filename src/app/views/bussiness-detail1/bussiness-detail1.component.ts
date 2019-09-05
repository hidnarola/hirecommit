import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-bussiness-detail1',
  templateUrl: './bussiness-detail1.component.html',
  styleUrls: ['./bussiness-detail1.component.scss']
})
export class BussinessDetail1Component implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }
  onFinish(){
   this.router.navigate(['/login']);
  }
}
