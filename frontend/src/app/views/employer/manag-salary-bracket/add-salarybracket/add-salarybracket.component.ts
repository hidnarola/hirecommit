import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControlName, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-salarybracket',
  templateUrl: './add-salarybracket.component.html',
  styleUrls: ['./add-salarybracket.component.scss']
})
export class AddSalarybracketComponent implements OnInit {
  AddSalaryBracket: FormGroup;
  submitted  = false;
  constructor(private router: Router) { }

  ngOnInit() {
    this.AddSalaryBracket = new FormGroup({
      country: new FormControl(null, [Validators.required]),
      from: new FormControl(null, [Validators.required]),
      to : new FormControl(null, [Validators.required])
    });
  }
  get f() {
    return this.AddSalaryBracket.controls;
  }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    if (flag) {
      this.AddSalaryBracket.reset();

    }
  }
  onClose() {
    this.router.navigate(['/employer/manage_salarybracket/view_salarybracket']);

  }

}
