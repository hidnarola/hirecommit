import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  name = 'Angular';
  private stepper: Stepper;
  constructor(private router: Router){}

  next() {
    this.stepper.next();
  }

  onSubmit() {
    return false;
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    })


  }
  onLogin(){
    this.router.navigate(['/login']);
  }
}
