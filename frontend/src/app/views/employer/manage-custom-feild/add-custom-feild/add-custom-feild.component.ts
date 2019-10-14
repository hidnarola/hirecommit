import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-custom-feild',
  templateUrl: './add-custom-feild.component.html',
  styleUrls: ['./add-custom-feild.component.scss']
})
export class AddCustomFeildComponent implements OnInit {
  panelTitle='Add Custom Feild'
  buttonTitle = 'Add';
  addCustomFeild: FormGroup;
  constructor() { }

  ngOnInit() {
    this.addCustomFeild = new FormGroup({
      customFeild: new FormControl(null, [Validators.required])
    })
  }
}
