import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidatelayout',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {}

  onCreatAccount() {
     this.router.navigate(['candidate/login']);
  }

}
