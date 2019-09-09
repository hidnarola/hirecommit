import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-dashboard',
  templateUrl: 'register.component.html'
})
export class RegisterComponent {

  constructor(public router: Router) { }

  onCreatAccount(){
     this.router.navigate(['/login']);
  }

}
