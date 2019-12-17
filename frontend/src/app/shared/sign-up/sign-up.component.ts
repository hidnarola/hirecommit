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
  public isFormSubmitted;
  public formData: any;
  countryID: any;
  code: any;
  isChecked;
  marked = false;
  step2 = false;
  step3 = false;
  alldata: any;
  Business_Type: any = [];
  show_spinner = false;
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
      email: new FormControl('', [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      password: new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      country: new FormControl('', [Validators.required]),
      businesstype: new FormControl('', [Validators.required]),
      companyname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      // website: new FormControl('', [Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)]),
      website: new FormControl(''),
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      countrycode: new FormControl('', [Validators.required]),
      // tslint:disable-next-line: max-line-length
      contactno: new FormControl('',
        Validators.compose(
          [Validators.required,
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)])),
      recaptcha: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    });
  }


  ngOnInit() {
    this.stepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });

    this.service.country_registration().subscribe(res => {
      this.alldata = res['data'];
      console.log('employer registration country>', res['data']);
      res['data'].forEach(element => {
        this.Country.push({ 'label': element.country, 'value': element._id });
      });
    });

    // this.service.country_data().subscribe(res => {
    //   this.code = res['data'];
    //   res['data'].forEach(element => {
    //     this.Country.push({ 'label': element.country, 'value': element._id });
    //   });
    // });
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }


  next1() {
    this.isFormSubmitted = true;
    // tslint:disable-next-line: max-line-length
    console.log('this.registerForm.controls[`email`].valid=>', this.registerForm.controls[`email`].valid);
    // this.checkEmail();
    if (this.registerForm.controls['email'].valid && this.registerForm.controls['password'].valid
      //  && this.registerForm.controls['recaptcha'].valid
    ) {
      this.isFormSubmitted = false;
      this.step2 = true;
      this.stepper.next();
    }
  }

  next2() {
    this.isFormSubmitted = true;
    // tslint:disable-next-line: max-line-length
    if (this.registerForm.controls['country'].valid && this.registerForm.controls['businesstype'].valid) {
      this.isFormSubmitted = false;
      this.step3 = true;
      this.stepper.next();
    }
  }

  checkPattern(e) {
    console.log('e=>', e['target'].value);
    console.log('this.registerForm.value.website=>', this.registerForm.value.website);

    if (this.registerForm.value.website.length > 0) {
      this.registerForm.controls['website'].setValidators([Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)]);
    } else {
      this.registerForm.controls['website'].setValidators(null);
    }
    this.registerForm.controls['website'].updateValueAndValidity();
    console.log('this.registerForm=>', this.registerForm);
  }

  checkEmail() {
    this.service.check_employer_email({ 'email': this.registerForm.value.email }).subscribe(res => {
    }, (err) => {
      this.registerForm.controls['email'].setErrors({ 'isExist': true });
      this.registerForm.updateValueAndValidity();
    });
  }


  // }

  // Update form validation
  updateValidation() {
    this.registerForm.updateValueAndValidity();
  }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    console.log('valid => ', valid);
    console.log('registerForm => ', this.registerForm);
    if (valid) {
      this.show_spinner = true;
      this.service.employer_signup(this.registerForm.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        if (res['status'] === 0) {
          console.log('error 1 => ');
          this.show_spinner = false;
          this.toastr.error(res['responseError'], 'Error!', { timeOut: 3000 });
          // this.formData.recaptcha = '';
        } else if (res['data'].status === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          Swal.fire({
            type: 'success',
            text: res['message']
          });
          this.router.navigate(['/login']);
        } else {
          console.log('else => ');
        }
      }, (err) => {
        console.log('error => ', err);
        console.log('spinner', this.show_spinner);

        this.show_spinner = false;
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 9000 });
      });
    } else {
      console.log('this.registerForm.value == else => ', this.registerForm.value);
    }

    console.log('this.registerForm.value == last ======> ', this.registerForm.value);
  }

  checkValue(e) {
    console.log('e>>', e);
    this.marked = e;
  }

  getCode(e) {
    console.log('element of country =>', e.value);

    this.countryID = this.alldata.find(x => x._id === e.value);
    console.log('countryID', this.countryID.country);

    this.Business_Type = [];
    this.service.get_Type(this.countryID.country).subscribe(res => {
      console.log('Business types of selected country =>', res['data']);
      res['data'].forEach(element => {
        this.Business_Type.push({ 'label': element.name, 'value': element._id });
      });
      console.log('drop dowm of selected country =>', this.Business_Type);

      if (this.countryID.country === 'India') {
        this.registerForm.controls['countrycode'].setValue('+91');
      } else {
        this.registerForm.controls['countrycode'].setValue('+1');
      }

    });

    // this.code.forEach(element => {
    //   if (e.value === element._id) {
    //     this.registerForm.controls['countrycode'].setValue('+' + element.country_code)
    //   }
    // });
  }

  // onLogin() {
  //   this.router.navigate(['/login']);
  // }

}
