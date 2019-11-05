import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;
  public isFormSubmitted;
  public formData: any;
  show_spinner = false;
  constructor(
    private router: Router,
    private service: CommonService,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  ngOnInit() { }



  sendMail(valid) {
    this.isFormSubmitted = true;
    this.show_spinner = true;
    if (valid) {
      this.service.forgot_password(this.form.value).subscribe(res => {
        this.isFormSubmitted = false;
        this.formData = {};
        if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.router.navigate(['/login']);
        }
      }, (err) => {
        this.show_spinner = false;
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }

  }

}
