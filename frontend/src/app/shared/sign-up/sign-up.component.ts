import { Component, OnInit, ViewChild } from '@angular/core';
import Stepper from 'bs-stepper';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';
import { log } from 'util';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  registerForm: FormGroup;
  protected aFormGroup: FormGroup;
  public isFormSubmitted;
  public formData: any;
  countryID: any;
  code: any;
  isChecked;
  isExist: any;
  marked = false;
  step2 = false;
  step3 = false;
  alldata: any;
  decoded_Email: String;
  Business_Type: any = [];
  show_spinner = false;
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  // local
  // siteKey = '6LeZgbkUAAAAAIft5rRxJ27ODXKzH_44jCRJtdPU';
  // live
  siteKey = environment.captcha_site_key;
  is_submitted = false;
  private stepper: Stepper;
  Country: any = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private service: CommonService,
    public fb: FormBuilder,
    public toastr: ToastrService,
    public activatedRoute: ActivatedRoute
  ) {


    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;

    this.formData = {};
    this.registerForm = this.fb.group({
      email: new FormControl('', [
        Validators.required,
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

    if (this.activatedRoute.snapshot.queryParams.email) {
      this.decoded_Email = atob(this.activatedRoute.snapshot.queryParams.email);
      this.formData.email = this.decoded_Email;
    }
    this.service.country_registration().subscribe(res => {
      this.alldata = res['data'];
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
    // // tslint:disable-next-line: max-line-length
    // const checkEmail = this.checkEmail2();
    if (this.registerForm.value['email']) {

      const reg = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

      if (reg.test(this.registerForm.value['email'])) {
        // this.registerForm.controls['email'].setErrors({ 'isExist': true });
        this.service.check_employer_email({ 'email': this.registerForm.value.email }).subscribe(res => {
          if (res && this.registerForm.controls['password'].valid) {
            this.isFormSubmitted = false;
            this.step2 = true;
            this.stepper.next();
          }

        }, (err) => {
          this.registerForm.controls['email'].setErrors({ 'isExist': true });
          this.registerForm.updateValueAndValidity();
        });
        this.registerForm.updateValueAndValidity();
      } else {
        this.registerForm.controls['email'].setValidators([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      }

    } else if (this.registerForm.controls['email'].valid && this.registerForm.controls['password'].valid) {

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
    if (this.registerForm.value.website.length > 0) {
      this.registerForm.controls['website'].setValidators([Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/)]);
    } else {
      this.registerForm.controls['website'].setValidators(null);
    }
    this.registerForm.controls['website'].updateValueAndValidity();
  }

  checkEmail() {
    if (this.registerForm.value.email !== undefined &&  this.registerForm.value.email.length > 0) {
      this.service.check_employer_email({ 'email': this.registerForm.value.email }).subscribe(res => {
      }, (err) => {
        this.registerForm.controls['email'].setErrors({ 'isExist': true });
        this.registerForm.updateValueAndValidity();
      });
    }
  }
  checkEmail2() {
    // let isExist;
    if (this.registerForm.value.email.length > 0) {
      this.service.check_employer_email({ 'email': this.registerForm.value.email }).subscribe(res => {
        this.isExist = 'false';
      }, (err) => {
        this.isExist = 'true';
      }
      );
    }
    console.log('=>', this.isExist);
    return this.isExist;
  }
  // }

  // Update form validation
  updateValidation() {
    this.registerForm.updateValueAndValidity();
  }

  checkValue(e) {
    this.marked = e;
    // this.isChecked = e;
  }
  reset(): void {
    this.captchaElem.resetCaptcha();
  }

  onSubmit(valid) {
    this.is_submitted = true;
    this.isFormSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      this.registerForm.value.isChecked = this.marked;
      this.service.employer_signup(this.registerForm.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        if (res['status'] === 0) {
          this.show_spinner = false;
          this.toastr.error(res['responseError'], 'Error!', { timeOut: 3000 });
          // this.formData.recaptcha = '';
        } else if (res['data'].status === 1) {

          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          Swal.fire({
            type: 'success',
            text: res['message']
          }).then(function (isConfirm) {
            if (isConfirm) {
              this.router.navigate([environment.employerURL + 'login']);
            }
          });
        }
      }, (err) => {
        this.show_spinner = false;
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
        this.reset();
      });
    } else {
      this.show_spinner = false;
    }


  }



  getCode(e) {

    this.countryID = this.alldata.find(x => x._id === e.value);
    this.Business_Type = [];
    this.service.get_Type(this.countryID.country).subscribe(res => {
      res['data'].forEach(element => {
        this.Business_Type.push({ 'label': element.name, 'value': element._id });
      });
      if (this.countryID.country === 'India') {
        this.registerForm.controls['countrycode'].setValue('+91');
      } else {
        this.registerForm.controls['countrycode'].setValue('+1');
      }

    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
    if (this.registerForm.value.businesstype) {

      // this.registerForm.value.businesstype = '';
      this.registerForm.controls['businesstype'].setValue('');
      this.registerForm.controls['businesstype'].setValidators([Validators.required]);
      this.updateValidation();
    }


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
