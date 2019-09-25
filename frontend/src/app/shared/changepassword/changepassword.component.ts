import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  form: FormGroup;
  submitform: FormGroup;
  public isFormSubmited;
  public formData: any;
  token: any;

  constructor(private router: Router, public fb: FormBuilder, public service: CommonService, private toastr: ToastrService) {
    this.formData = {};
    this.form = this.fb.group({
      'oldpassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
      'newpassword': new FormControl('', Validators.compose([Validators.required, Validators.minLength(8)])),
     'confirmnewpassword': new FormControl('', [Validators.required])
    }, { validator: this.checkPasswords });
   }

  onClose() {
    this.router.navigate(['/employer/manage_offer/created_offerlist']);
  }

  ngOnInit () {
    this.token = localStorage.getItem('token');
    console.log(this.token);
  }

  submit(valid) {
    this.isFormSubmited = true;
    if (valid) {
      this.submitform = new FormGroup({
        token: new FormControl(this.token),
        oldpassword: new FormControl(this.form.value.oldpassword),
        newpassword: new FormControl(this.form.value.newpassword)
      });
      this.service.change_password(this.submitform.value).subscribe(res => {
        this.isFormSubmited = false;
        if (res['status'] === 1) {
          this.toastr.success(res['message'], 'Error!', {timeOut: 3000});
          this.router.navigate(['/employer/manage_offer/created_offerlist']);
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
      });
    }
  }

  checkPasswords(g: FormGroup) {
    const password = g.get('newpassword').value;
    const confirmpassword = g.get('confirmnewpassword').value;
    if (password !== undefined && password != null && confirmpassword !== null && confirmpassword !== undefined) {
      return password === confirmpassword ? null : g.get('confirmnewpassword').setErrors({ 'mismatch': true });
    }
  }

}
