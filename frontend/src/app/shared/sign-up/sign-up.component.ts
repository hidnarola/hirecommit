import { Component, OnInit } from '@angular/core';
import Stepper from 'bs-stepper';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

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
  code: any;
  isChecked = false;
  marked = false;
  step2 = false;
  step3 = false;
  Business_Type = [
    { label: 'Select Business Type', value: '' },
    { label: 'Private', value: 'Private' },
    { label: 'Individual', value: 'Individual' },
    { label: 'Partnership', value: 'Partnership' }
  ];

  // local
  // siteKey = '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU';
  // live
  siteKey = environment.captcha_site_key;

  private stepper: Stepper;
  Country: any = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: CommonService,
    public fb: FormBuilder,
    public toastr: ToastrService
  ) {
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
      contactno: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(10), Validators.minLength(10)])),
      recaptcha: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    });
  }

  next1() {
    this.isFormSubmited = true;
    // tslint:disable-next-line: max-line-length
    if (this.registerForm.controls['email'].valid && this.registerForm.controls['password'].valid && this.registerForm.controls['recaptcha'].valid) {
      this.isFormSubmited = false;
      this.step2 = true;
      this.stepper.next();
    }
  }

  next2() {
    this.isFormSubmited = true;
    // tslint:disable-next-line: max-line-length
    if (this.registerForm.controls['country'].valid && this.registerForm.controls['businesstype'].valid) {
      this.isFormSubmited = false;
      this.step3 = true;
      this.stepper.next();
    }
  }

  onSubmit(valid) {
    this.isFormSubmited = true;
    if (valid) {
      this.service.employer_signup(this.registerForm.value).subscribe(res => {
        this.isFormSubmited = false;
        this.formData = {};
        if (res['status'] === 0) {

        } else if (res['data'].status === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          Swal.fire({
            type: 'success',
            text: res['message']
          });
          this.router.navigate(['/login']);
        } else { }
      });
    }
  }

  checkValue(e) {
    console.log('e>>', e);

    this.marked = e
  }


  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.service.country_data().subscribe(res => {
      this.code = res['data'];
      res['data'].forEach(element => {
        this.Country.push({ 'label': element.country, 'value': element._id });
      });
    });
  }

  getCode(e) {
    this.code.forEach(element => {
      if (e.value === element._id) {

        this.registerForm.controls['countrycode'].setValue('+' + element.country_code)
      }
    });
  }

  // onLogin() {
  //   this.router.navigate(['/login']);
  // }

}
