import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employer',
  templateUrl: './add-employer.component.html',
  styleUrls: ['./add-employer.component.scss']
})
export class AddEmployerComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  fileFormData = new FormData();
  postFormData = new FormData();
  file: any;
  cancel_link = '/admin/employers/view';

  constructor(private router: Router) {
    console.log('admin- employer: add-employer component => ');
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      designation: new FormControl(null, [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
      avatar: new FormControl(null),
      status: new FormControl('unapprove')
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    if (flag) {
      this.registerForm.reset();
      this.router.navigate(['/employer/view']);
    }
  }

}
