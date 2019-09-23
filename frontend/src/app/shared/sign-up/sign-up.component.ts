import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  protected aFormGroup: FormGroup;
  siteKey = '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU';
  // siteKey = '6LejT5wUAAAAAAGmT0EnG6qh8yMcOlfm5AZ1dE-s';

  private stepper: Stepper;
  constructor(private router: Router,  private formBuilder: FormBuilder, private service: CommonService) {}

  next() {
    this.stepper.next();
  }

  onSubmit() {
    console.log(this.registerForm.value);
    this.service.employer_signup(this.registerForm.value).subscribe(res => {
      console.log(res);
      if (res['status'] === 0) {
        console.log(res);
      } else if (res['data'].status === 1) {
        Swal.fire({
          type: 'success',
          text: res['message']
        });
        this.router.navigate(['/login']);
      } else {
        console.log(res);
      }
    });
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.registerForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      businesstype: new FormControl(null, [Validators.required]),
      companyname: new FormControl(null, [Validators.required]),
      website: new FormControl(null),
      username: new FormControl(null, [Validators.required]),
      countrycode: new FormControl(null, [Validators.required]),
      contactno: new FormControl(null, [Validators.required]),
      recaptcha: new FormControl(null, [ Validators.required])
    });
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
}
