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
  imgurl: any = '';
  Country = [
    { label: 'Select Country', value: '' },
    { label: 'India', value: 'India' },
    { label: 'United States', value: 'Us' }
  ];
  codeList: any;
  Document_optoins: any = []

  // tslint:disable-next-line: max-line-length

  constructor(
    public router: Router,
    private service: CommonService,
    private toastr: ToastrService,
    public fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) {
    this.registerData = {};
    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      documentImage: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      countrycode: new FormControl('', [Validators.required]),
      contactno: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(10), Validators.minLength(10)])),
      country: new FormControl('', [Validators.required]),
      documenttype: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmpassword: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });

    // this.documentImage = this.fb.group({
    //   documentimage: new FormControl('', [Validators.required]),
    // });
  }

  ngOnInit() { }

  onFileChange(event) {
    this.fileFormData = new FormData();
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      console.log('uploaded file =>', this.file.name);
      console.log('ater splite =>', this.file.name.split('.')[1]);
      // if (this.file.name.split('.')[1] === 'png' || this.file.name.split('.')[1] === 'jpg' || this.file.name.split('.')[1] === 'jpeg') {

      this.fileFormData.append('filename', this.file);
      reader.readAsDataURL(this.file);
      reader.onload = this._handleReaderLoaded.bind(this);
      // reader.onload = () => {
      //   this.documentImage.patchValue({
      //     documentimage: reader.result
      //  });
      this.imgurl = reader.result;
      // need to run CD since file load runs outside of zone
      this.cd.markForCheck();
      // }
      // else {
      //   console.log('image type is not valuid, please enter image in format of PNG, JPG or JPEG!');

      // }

    }
  }

  getCode(e) {

    console.log("element of country =>>", e.value);
    this.Document_optoins = [];
    this.service.get_Type(e.value).subscribe(res => {
      console.log('Document Types of selected country =>', res['document']);
      res['document'].forEach(element => {
        this.Document_optoins.push({ 'label': element.name, 'value': element._id });
      });
      console.log('drop dowm of selected country =>', this.Document_optoins);

      if (e.value === 'India') {
        this.registerForm.controls['countrycode'].setValue('+91')
      }
      else {
        this.registerForm.controls['countrycode'].setValue('+1')
      }

    })

    // this.code.forEach(element => {
    //   if (e.value === element._id) {
    //     this.registerForm.controls['countrycode'].setValue('+' + element.country_code);
    //   }
    // });
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.imgurl = reader.result;
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
    // this.isChecked = e;
  }

  onSubmit(valid) {
    console.log('this.marked ===>', this.marked);
    console.log('this.registerForm ===>', this.registerForm);
    console.log('this.registerForm.isChecked  ===>', this.registerForm.controls['isChecked'].valid);

    this.isFormSubmited = true;
    if (valid && this.marked) {
      this.registerData.documentImage = this.imgurl;
      console.log('this.registerData', this.registerData);

      this.formData = new FormData();
      // tslint:disable-next-line: forin
      for (const key in this.registerData) {
        const value = this.registerData[key];
        this.formData.append(key, value);
      }
      // if (this.fileFormData.get('filename')) {
      //   this.formData.append('documentimage', this.imgurl);
      // }
      //  this.registerForm.controls.documentImage.setValue(this.imgurl)
      // this.documentImage.controls.documentimage.setValue(this.imgurl);
      console.log('this.formData =>>', this.formData);

      this.service.candidate_signup(this.formData).subscribe(res => {
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
