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
  constructor(private router: Router, private service: CommonService, private toastr: ToastrService) { }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required)
    });
  }

  Onclick() {
    this.router.navigate(['/login']);
  }

  sendMail() {
    this.service.forgot_password(this.form.value).subscribe(res => {
      if (res['status'] === 1) {
        this.toastr.success(res['message'], 'Success!', {timeOut: 3000});
        this.router.navigate(['/login']);
      }
    }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
      });
  }
}
