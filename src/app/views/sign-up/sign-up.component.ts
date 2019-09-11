import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  protected aFormGroup: FormGroup;
  siteKey = '6LcvoUgUAAAAAJJbhcXvLn3KgG-pyULLusaU4mL1';
  name = 'Angular';
  private stepper: Stepper;
  constructor(private router: Router, private formBuilder: FormBuilder) {}

  next() {
    this.stepper.next();
  }

  onSubmit() {
    return false;
  }

  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

  }
  onLogin() {
    this.router.navigate(['/login']);
  }
}
