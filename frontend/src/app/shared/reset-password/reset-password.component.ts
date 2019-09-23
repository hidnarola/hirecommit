import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  submitform: FormGroup;
  params_token: any;
  constructor(private activatedRoute: ActivatedRoute, private service: CommonService, private toastr: ToastrService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      confirmpassword: new FormControl(null , [Validators.required])
    });
  }

  confirm () {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
    });
    this.submitform = new FormGroup({
      token: new FormControl(this.params_token.token),
      password: new FormControl(this.form.value.password)
    });

    this.service.reset_password(this.submitform.value).subscribe(res => {
      if (res['status'] === 1) {
        this.toastr.success(res['message'], 'Error!', {timeOut: 3000});
        this.router.navigate(['/login']);
      }
    }, (err) => {
      this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
    });
  }

}
