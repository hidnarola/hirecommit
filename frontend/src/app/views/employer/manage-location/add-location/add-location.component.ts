import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {

  addLocation: FormGroup;
  submitted = false;
  constructor(private router: Router) { }

  ngOnInit() {

    this.addLocation = new FormGroup({
      country: new FormControl(null,[Validators.required]),
      location: new FormControl(null, [Validators.required])
    
    });
  }

  get f() {return  this.addLocation.controls;}

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    console.log(this.addLocation.value);

  if (flag) {
    this.addLocation.reset();
    this.router.navigate(['/employer/manage_location/view_location']);
  }
  }

  onClose() {
    this.router.navigate(['/employer/manage_location/view_location']);
  }
}
