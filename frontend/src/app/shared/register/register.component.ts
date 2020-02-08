import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-candidatelayout',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  code: any = [];
  registerForm: FormGroup;
  documentImage: FormGroup;
  employerURL: String;
  candidateURL: String;
  mainURL: String;
  public registerData: any;
  fileFormData = new FormData();
  file: File = null;
  public isFormSubmitted;
  formData;
  isChecked;
  marked = false;
  imgurl;
  show_spinner = false;
  alldata: any;
  countryList: any = [];
  codeList: any;
  Document_optoins: any = [];
  countryID: any;
  siteKey = environment.captcha_site_key;
  // tslint:disable-next-line: max-line-length
  labelName: any;
  isDocumentType = false;
  isDrivingLicense = false;
  constructor(

    public router: Router,
    private service: CommonService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    public fbb: FormBuilder,
    private cd: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute
  ) {

    this.employerURL = environment.employerURL;
    this.candidateURL = environment.candidateURL;
    this.mainURL = environment.mainURL;
    this.registerData = {};

    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      lastname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      // documentImage: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      country: new FormControl('', [Validators.required]),
      countrycode: new FormControl('', [Validators.required]),
      contactno: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
        ])),
      documenttype: new FormControl('', [Validators.required]),
      documentNumber: new FormControl(''),
      drivingLicenseState: new FormControl(''),
      password: new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      confirmpassword: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      recaptcha: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });

    this.documentImage = this.fbb.group({
      documentimage: new FormControl(''),
    });
  }


  ngOnInit() {
    this.service.country_registration().subscribe(res => {
      this.alldata = res['data'];
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country, 'value': element._id });
      });
    });
    this.formData = new FormData();

    if (this.activatedRoute.snapshot.queryParams.email) {
      const decode_email = atob(this.activatedRoute.snapshot.queryParams.email);
      this.registerData.email = decode_email;
    }
  }

  checkEmail() {
    this.service.check_candidate_email({ 'email': this.registerForm.value.email }).subscribe(res => {
    }, (err) => {
      this.registerForm.controls['email'].setErrors({ 'isExist': true });
      this.registerForm.updateValueAndValidity();
    });

  }

  checkEmail2() {
    let isExist;

    if (this.registerForm.value.email.length > 0) {
      this.service.check_employer_email({ 'email': this.registerForm.value.email }).subscribe(res => {
        isExist = 'true';
      }, (err) => {
        isExist = 'false';
      });
    }
    return isExist;
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  // check for Aadhar card number
  checkAadharNumber(control: FormControl) {
    const adharcardTwelveDigit = /^\d{12}$/;
    const adharSixteenDigit = /^\d{16}$/;
    if (control.value && control.value !== '' && control.valid !== null) {
      const isValid = (control.value.match(adharcardTwelveDigit) || control.value.match(adharSixteenDigit));
      return isValid ? null : { 'invalid': true };
    }
  }

  checkPANCardNumber(control: FormControl) {
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    if (control.value && control.value !== '' && control.valid !== null) {
      regpan.test(control.value);
      const isValid = control.value.match(regpan);
      // valid pan card number
      return isValid ? null : { 'invalid': true };
    }

  }
  checkDrivingLicense(control: FormControl) {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{15,15}$/;
    console.log('control.value=>', control.value);
    if (control.value && control.value !== '' && control.valid !== null) {
      pattern.test(control.value);
      const isValid = control.value.match(pattern);
      // valid pan card number
      return isValid ? null : { 'invalid': true };
    }
  }
  checkDocumentNumber(e) {
    this.service.check_document_number({ 'documentNumber': e.target.value }).subscribe(res => {
    }, (err) => {
      this.registerForm.controls['documentNumber'].setErrors({ 'isExist': true });
      this.registerForm.updateValueAndValidity();
    });
  }

  DocumentType(e) {
    this.isDocumentType = true;
    this.registerForm.controls['documentNumber'].setValidators(null);
    this.registerForm.controls['drivingLicenseState'].setValidators(null);
    this.registerForm.controls.documentNumber.setValue('');
    this.registerForm.controls.drivingLicenseState.setValue('');
    //  "5dae95f549f04b196089e906" = AadharCard
    //  "5dae95f549f04b196089e907" = PanCard
    //  "5dae95f549f04b196089e908" = Driving Licence
    if (e.value === '5dae95f549f04b196089e907') {
      this.isDrivingLicense = false;
      this.labelName = 'PAN Card Number';
      this.registerForm.controls['documentNumber'].setValidators([Validators.required, this.checkPANCardNumber]);
    } else if (e.value === '5dae95f549f04b196089e906') {
      this.isDrivingLicense = false;
      this.registerForm.controls['documentNumber'].setValidators([Validators.required, this.checkAadharNumber]);
      this.labelName = 'Aadhar Card Number';
    } else if (e.value === '5dae95f549f04b196089e908') {
      this.isDrivingLicense = true;
      this.labelName = 'Driving License Number';
      this.registerForm.controls['drivingLicenseState'].setValidators([Validators.required, this.noWhitespaceValidator]);
      this.registerForm.controls['documentNumber'].setValidators([Validators.required, this.checkDrivingLicense]);
    }
    this.registerForm.updateValueAndValidity();
  }

  onFileChange(e) {
    this.fileFormData = new FormData();
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      this.file = e.target.files[0];
      const fileName = this.file.name.split('.');
      if (this.file.size < 5000000) {
        this.fileFormData.append('filename', this.file);

        if (fileName[1] === 'png' || fileName[1] === 'jpg' || fileName[1] === 'jpeg') {
          reader.readAsDataURL(this.file);
          reader.onload = () => {
            this.documentImage.patchValue({
              documentimage: reader.result
            });
            // need to run CD since file load runs outside of zone
            this.cd.markForCheck();
          };
        } else {
          this.documentImage.controls['documentimage'].setErrors({ 'fileTypeValidation': true });
        }
      } else {
        this.documentImage.controls['documentimage'].setErrors({ 'fileSizeValidation': true });
      }
      this.documentImage.updateValueAndValidity();
    }



    // if (file.size <= 500000) {
    //   this.image_upload = file;
    //   this.track_img = environment.API_URL + environment.ARTIST_TRACK + file.name;
    //   const fr = new FileReader();
    //   fr.onload = (e: any) => {
    //     this.track_img = e.target.result;
    //     this.add_track_img = e.target.result;
    //   };
    //   fr.readAsDataURL(file);
    //   this.add_track_img = environment.API_URL + environment.ARTIST_TRACK + file;
    // } else {
    //   this.toastr.error('Please choose Image less then 500 kb.', 'Error!');
    //   return false;
    // }



  }

  getCode(e) {
    this.registerForm.controls['documentNumber'].setValidators(null);
    this.registerForm.controls['drivingLicenseState'].setValidators(null);
    this.registerForm.controls.documentNumber.setValue('');
    this.registerForm.controls.drivingLicenseState.setValue('');
    this.countryID = this.alldata.find(x => x._id === e.value);
    this.Document_optoins = [];
    this.isDocumentType = false;
    this.service.get_Type(this.countryID.country).subscribe(res => {
      this.Document_optoins = [];
      res['document'].forEach(element => {
        this.Document_optoins.push({ 'label': element.name, 'value': element._id });
      });

      if (this.countryID.country === 'India') {
        this.isDrivingLicense = false;
        this.registerForm.controls['countrycode'].setValue('+91');
      } else {
        this.registerForm.controls['countrycode'].setValue('+1');
      }

      this.registerForm.updateValueAndValidity();

    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  checkPasswords(g: FormGroup) { // here we have the 'passwords' group
    const password = g.get('password').value;
    const confirmpassword = g.get('confirmpassword').value;

    // if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
    if (password && confirmpassword) {
      return password === confirmpassword ?
        g.get('confirmpassword').setErrors(null) :
        // null :
        g.get('confirmpassword').setErrors({ 'mismatch': true });
    }
  }

  checkValue(e) {
    this.marked = e;
  }
  reset(): void {
    this.captchaElem.resetCaptcha();
  }


  onSubmit(valid) {
    this.isFormSubmitted = true;

    if (this.registerForm.value['email']) {
      const reg = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

      if (reg.test(this.registerForm.value['email'])) {
        // this.registerForm.controls['email'].setErrors({ 'isExist': true });
        this.checkEmail();
        this.registerForm.updateValueAndValidity();
      } else {
        this.registerForm.controls['email'].setValidators([Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]);
      }
    }
    if (valid && this.marked) {
      this.show_spinner = true;



      // else if (this.registerForm.value['email'].length > 0) {

      // }

      this.formData = new FormData();
      // tslint:disable-next-line: forin
      for (const key in this.registerData) {
        const value = this.registerData[key];
        this.formData.append(key, value);
      }
      if (this.fileFormData.get('filename')) {
        this.formData.append('documentimage', this.fileFormData.get('filename'));
      }
      this.service.candidate_signup(this.formData).subscribe(res => {

        this.isFormSubmitted = false;
        // this.registerData = {};
        if (res['status'] === 0) {
          this.show_spinner = false;
          this.toastr.error(res['responseError'], 'Error!', { timeOut: 3000 });
        } else if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          Swal.fire({
            type: 'success',
            text: res['message']
          }).then(function (isConfirm) {
            if (isConfirm) {
              this.router.navigate([environment.candidateURL + 'login']);
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


}
