import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidatelayout',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  code: any = [];
  registerForm: FormGroup;
  documentImage: FormGroup;
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
  // tslint:disable-next-line: max-line-length

  constructor(
    public router: Router,
    private service: CommonService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    public fbb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.registerData = {};
    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      lastname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      // documentImage: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      country: new FormControl('', [Validators.required]),
      countrycode: new FormControl('', [Validators.required]),
      contactno: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
        ])),
      documenttype: new FormControl('', [Validators.required]),
      password: new FormControl('',
        Validators.compose([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.minLength(8),
          Validators.pattern(/((?=.*\d)(?=.*[a-z]))/)])),
      confirmpassword: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
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

  }



  checkEmail() {
    this.service.check_candidate_email({ 'email': this.registerForm.value.email }).subscribe(res => {
    }, (err) => {
      this.registerForm.controls['email'].setErrors({ 'isExist': true });
      this.registerForm.updateValueAndValidity();
    });

  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  onFileChange(e) {
    this.fileFormData = new FormData();
    const reader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      this.file = e.target.files[0];
      console.log('this.file => ', this.file);
      if (this.file.size < 5000000) {
        this.fileFormData.append('filename', this.file);

        reader.readAsDataURL(this.file);
        reader.onload = () => {
          this.documentImage.patchValue({
            documentimage: reader.result
          });
          // need to run CD since file load runs outside of zone
          this.cd.markForCheck();
        };
      } else {
        console.log('error => ');
        this.documentImage.controls['documentimage'].setErrors({ 'fileSizeValidation': true });
        this.documentImage.updateValueAndValidity();
      }
      console.log('this.registerForm => ', this.documentImage.controls['documentimage']);

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
    console.log('element of country =>>', e.value);
    this.countryID = this.alldata.find(x => x._id === e.value);
    console.log('countryID', this.countryID.country);
    this.Document_optoins = [];
    this.service.get_Type(this.countryID.country).subscribe(res => {
      console.log('response', res['document']);
      console.log('Document Types of selected country =>', res['document']);
      this.Document_optoins = [];
      res['document'].forEach(element => {
        this.Document_optoins.push({ 'label': element.name, 'value': element._id });
      });

      if (this.countryID.country === 'India') {
        this.registerForm.controls['countrycode'].setValue('+91');
      } else {
        this.registerForm.controls['countrycode'].setValue('+1');
      }

      this.registerForm.updateValueAndValidity();

    });
  }

  checkPasswords(g: FormGroup) { // here we have the 'passwords' group
    const password = g.get('password').value;
    const confirmpassword = g.get('confirmpassword').value;
    console.log('password======================>', password);
    console.log('confirmpassword=================>', confirmpassword);

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

  onSubmit(valid) {
    this.isFormSubmitted = true;
    console.log('form=>', this.registerForm);

    console.log('=>', valid, this.marked);

    if (valid && this.marked) {
      this.show_spinner = true;
      this.formData = new FormData();
      // tslint:disable-next-line: forin
      for (const key in this.registerData) {
        const value = this.registerData[key];
        this.formData.append(key, value);
      }
      console.log('this.formData=>', this.formData);

      if (this.fileFormData.get('filename')) {
        this.formData.append('documentimage', this.fileFormData.get('filename'));
      }

      this.service.candidate_signup(this.formData).subscribe(res => {
        console.log(res);
        this.isFormSubmitted = false;
        this.registerData = {};
        if (res['status'] === 0) {
          this.toastr.error(res['message'], 'Error!', { timeOut: 3000 });
        } else if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.router.navigate(['/login']);
        }
      }, (err) => {
        console.log(this.show_spinner);

        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
        this.show_spinner = false;
      });
    }
  }


}
