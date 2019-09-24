import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-candidatelayout',
  templateUrl: './register.component.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  documentImage: FormGroup;
  public registerData: any;
  fileFormData;
  file: File = null;
  public isFormSubmited;
  formData;
  isChecked = false;
  marked = false;

  // tslint:disable-next-line: max-line-length
  constructor(public router: Router, private service: CommonService, private toastr: ToastrService, public fb: FormBuilder,  private cd: ChangeDetectorRef) {
    this.registerData = {};
    this.registerForm = this.fb.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      countrycode: new FormControl('', [Validators.required]),
      // tslint:disable-next-line: max-line-length
      contactno: new FormControl('', Validators.compose([Validators.required,  Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.maxLength(10), Validators.minLength(10)])),
      country: new FormControl('', [Validators.required]),
      documenttype: new FormControl('', [Validators.required]),
      password: new FormControl('',  Validators.compose([Validators.required, Validators.minLength(8)])),
      confirmpassword: new FormControl('', [Validators.required]),
      isChecked: new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });

    this.documentImage = this.fb.group({
      documentimage: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {

  }

  onSubmit (valid) {
    this.isFormSubmited = true;
    if (valid && this.marked) {
      this.formData  = new FormData();
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
          this.toastr.error(res['message'], 'Error!', {timeOut: 3000});
        } else if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Success!', {timeOut: 3000});
          this.router.navigate(['/login']);
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
      });
    }
  }

  onFileChange(event) {
    this.fileFormData = new FormData();
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileFormData.append('filename', this.file);

      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.documentImage.patchValue({
          documentimage: reader.result
       });
        // need to run CD since file load runs outside of zone
        this.cd.markForCheck();
      };
    }
  }

  checkPasswords(g: FormGroup) { // here we have the 'passwords' group
    const password = g.get('password').value;
    const confirmpassword = g.get('confirmpassword').value;
    if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
      return password === confirmpassword ? null : g.get('confirmpassword').setErrors({ 'mismatch': true });
    }
  }

  checkValue(e) {
    this.marked = e.target.checked;
    console.log(this.marked);
 }
}
