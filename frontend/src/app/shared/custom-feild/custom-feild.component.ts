import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-custom-feild',
  templateUrl: './custom-feild.component.html',
  styleUrls: ['./custom-feild.component.scss']
})
export class CustomFeildComponent implements OnInit {
  buttonTitle='Add';
  addCustomFeild : FormGroup;
  constructor() { }

  ngOnInit() {
    this.addCustomFeild = new FormGroup({
      customFeild: new FormControl(null,[Validators.required])
    })
  }

}
