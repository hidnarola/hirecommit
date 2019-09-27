import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employer-addoffer',
  templateUrl: './employer-addoffer.component.html',
  styleUrls: ['./employer-addoffer.component.scss']
})
export class EmployerAddofferComponent implements OnInit {

  addOrderForm: FormGroup;
  submitted = false;

  file: any;
  constructor(private router: Router) { }

  ngOnInit() {

    this.addOrderForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      salaryBracket: new FormControl(null, [Validators.required]),
      expiryDate: new FormControl(null, [Validators.required]),
      joiningDate: new FormControl(null, [Validators.required]),
      notes: new FormControl(null, [Validators.required]),
      customField1: new FormControl(null, [Validators.required]),
      customField2: new FormControl(null, [Validators.required]),
      customField3: new FormControl(null, [Validators.required]),
    });
  }

  get f() { return this.addOrderForm.controls; }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
      console.log(this.addOrderForm.value);

    if (flag) {
      this.addOrderForm.reset();
      this.router.navigate(['/employer/manage_offer/created_offerlist']);
    }
  }

  onClose() {
    this.router.navigate(['/employer/manage_offer/created_offerlist']);
  }

}
