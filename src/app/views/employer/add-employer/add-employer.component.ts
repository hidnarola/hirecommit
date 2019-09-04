import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployerService } from '../employer.service';

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
  constructor(private router: Router, public service: EmployerService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      designation: new FormControl(null, [Validators.required]),
      gender: new FormControl('male', [Validators.required]),
      avatar: new FormControl(null),
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
      console.log(this.registerForm.value);

    if (flag) {
      console.log(this.registerForm.value);
      this.service.addemployer(this.registerForm.value).subscribe(res => {
        console.log('registration done successfully');
      });
      this.registerForm.reset();
      this.router.navigate(['/employer/view']);
      this.service.checkHere();
    }
  }

}
