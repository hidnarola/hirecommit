import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GroupService } from '../manage-groups.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {

  addGroup: FormGroup;
  isFormSubmitted = false;
  cancel_link = '/employer/groups/list';
  groupData: any = {};
  editedData: any;
  isEdit: Boolean = false;
  show_communication: Boolean = false;

  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
  ) {

    // form controls
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

  ngOnInit() { }

  get f() { return this.addGroup.controls; }

  onSubmit(valid) {
    console.log('valid => ', valid);
    this.isFormSubmitted = true;
    if (valid) {
      this.service.addGroup(this.addGroup.value).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
          this.isFormSubmitted = false;
          this.addGroup.reset();
          this.router.navigate(['/employer/groups/list'])
        }
      }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }

  }

}
