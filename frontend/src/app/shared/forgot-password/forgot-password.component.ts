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

  isEmployer: Boolean = false;
  isCandidate: Boolean = false;
  isAdmin: Boolean = false;
  hostName: any = '';

  constructor(
    private router: Router,
    private service: CommonService,
    private toastr: ToastrService
  ) {
    this.formData = {};
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.hostName = window.location.hostname;
    if (this.hostName === 'employer.hirecommit.com') {
      this.isEmployer = true;
    } else if (this.hostName === 'candidate.hirecommit.com') {
      this.isCandidate = true;
    } else {
      this.isAdmin = true;
      // window.location.href = 'http://candidate.hirecommit.com/';
    }
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
    } else {
      this.show_spinner = false;
    }

  }

}
