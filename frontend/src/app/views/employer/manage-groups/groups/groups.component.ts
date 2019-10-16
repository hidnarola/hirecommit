import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupService } from '../manage-groups.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  addGroup: FormGroup;
  isFormSubmited = false;
  cancel_link = '/employer/groups/list';
  constructor(private router: Router, public fb: FormBuilder, private service: GroupService, private toastr: ToastrService) { }

  ngOnInit() {
    this.addGroup = this.fb.group({
      name: new FormControl('', [Validators.required]),
      high_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      high_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)])
    });
  }

  get f() { return this.addGroup.controls; }

  onSubmit(valid) {
    this.isFormSubmited = true;
    if (valid) {
      this.service.addGroup(this.addGroup.value).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
          this.isFormSubmited = false;
          this.addGroup.reset();
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }
  }

  reset() {
    this.isFormSubmited = false;
  }
}
