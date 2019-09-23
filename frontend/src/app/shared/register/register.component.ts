import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  registerData: any = [];
  fileFormData;
  file: File = null;
  formData;

  constructor(public router: Router, private service: CommonService, private toastr: ToastrService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstname: new FormControl(null, [Validators.required, Validators.email]),
      lastname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      countrycode: new FormControl(null, [Validators.required]),
      contactno: new FormControl(null, [Validators.required]),
      country: new FormControl(null, [Validators.required]),
      documenttype: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmpassword: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit () {
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

  onFileChange(event) {
    this.fileFormData = new FormData();
    if (event.target.files && event.target.files.length > 0) {
      this.file = event.target.files[0];
      this.fileFormData.append('filename', this.file);
    }
  }

}
