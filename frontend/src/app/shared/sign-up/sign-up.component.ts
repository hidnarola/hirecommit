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
  public isFormSubmited;
  public formData: any;
  setp1: false;
  siteKey = '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU';
  // siteKey = '6LejT5wUAAAAAAGmT0EnG6qh8yMcOlfm5AZ1dE-s';

  private stepper: Stepper;
  constructor(private router: Router,  private formBuilder: FormBuilder, private service: CommonService, public fb: FormBuilder) {
    this.formData = {};
    this.registerForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      country: new FormControl('', [Validators.required]),
      businesstype: new FormControl('', [Validators.required]),
      companyname: new FormControl('', [Validators.required]),
      website: new FormControl(''),
      username: new FormControl('', [Validators.required]),
      countrycode: new FormControl('', [Validators.required]),
      // tslint:disable-next-line: max-line-length
      contactno: new FormControl('', Validators.compose([Validators.required,  Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(10), Validators.minLength(10)])),
      recaptcha: new FormControl('', [ Validators.required])
    });
  }

  next() {
    this.stepper.next();
  }

  onSubmit(valid) {
    console.log(this.registerForm.value);
    this.isFormSubmited = true;
    if (valid) {
      this.service.employer_signup(this.registerForm.value).subscribe(res => {
        this.isFormSubmited = false;
        this.formData = {};
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
  }

  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });
  }
  onLogin() {
    this.router.navigate(['/login']);
  }
}
