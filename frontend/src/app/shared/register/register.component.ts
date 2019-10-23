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
  fileFormData;
  file: File = null;
  public isFormSubmited;
  formData;
  isChecked;
  marked = false;
  imgurl;
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
    private cd: ChangeDetectorRef
  ) {
    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      // documentImage: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      country: new FormControl('', [Validators.required]),
      countrycode: new FormControl('', [Validators.required]),
      contactno: new FormControl('',
        Validators.compose([Validators.required,
        Validators.pattern(/^-?(0|[1-9]\d*)?$/),
        Validators.maxLength(10), Validators.minLength(10)])),
      documenttype: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmpassword: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });

    this.documentImage = this.fb.group({
      documentimage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.service.country_registration().subscribe(res => {
      this.alldata = res['data'];
      console.log('candidate registration country>', res['data']);
      res['data'].forEach(element => {
        this.countryList.push({ 'label': element.country, 'value': element._id });
      });
    });
    this.formData = new FormData();

  }

  onFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.file = e.target.files[0];
    }
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
      console.log('drop down of selected country =>', this.Document_optoins);

      if (this.countryID.country === 'India') {
        this.registerForm.controls['countrycode'].setValue('+91');
      } else {
        this.registerForm.controls['countrycode'].setValue('+1');
      }

    });
  }

  checkPasswords(g: FormGroup) { // here we have the 'passwords' group
    const password = g.get('password').value;
    const confirmpassword = g.get('confirmpassword').value;
    if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
      return password === confirmpassword ? null : g.get('confirmpassword').setErrors({ 'mismatch': true });
    }
  }

  checkValue(e) {
    console.log('e>>', e);
    this.marked = e;
  }

  onSubmit(valid) {
    this.isFormSubmited = true;
    if (valid && this.marked) {
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
        console.log(res);
        this.isFormSubmited = false;
        this.registerData = {};
        if (res['status'] === 0) {
          this.toastr.error(res['message'], 'Error!', { timeOut: 3000 });
        } else if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.router.navigate(['/login']);
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }
  }

}
