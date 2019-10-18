import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../manage-groups.service';

@Component({
  selector: 'app-group-add-edit',
  templateUrl: './group-add-edit.component.html',
  styleUrls: ['./group-add-edit.component.scss']
})
export class GroupAddEditComponent implements OnInit {

  addGroup: FormGroup;
  isFormSubmited = false;
  cancel_link = '/employer/groups/list';
  id: any;
  groupData: any = {};
  isEdit = false;
  buttonTitle = 'Add';
  panelTitle = 'Add Group';
  editedData: any;

  constructor(private router: Router,
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.buttonTitle = 'Update';
      this.panelTitle = 'Edit Group';
      console.log('params id', this.id);
    });

    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data']
      this.groupData = this.groupData[0];
      console.log('groupData >> ', this.groupData);

    })

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
    console.log('p1==>', this.id);
    if (this.id && this.id != 0) {

      console.log('edit==>', this.id);

      let obj = {
        "id": this.id,
        name: this.groupData['name'],
        high_unopened: this.groupData['high_unopened'],
        high_notreplied: this.groupData['high_notreplied'],
        medium_unopened: this.groupData['medium_unopened'],
        medium_notreplied: this.groupData['medium_notreplied'],
        low_unopened: this.groupData['low_unopened'],
        low_notreplied: this.groupData['low_notreplied'],

      }
      console.log('Edited!!', obj);
      this.service.edit_group(obj).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.isFormSubmited = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.addGroup.reset();
        }
        this.router.navigate(['/employer/groups/list'])
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    }
    else {
      this.buttonTitle = 'Add';
      this.panelTitle = 'Add Group';
      if (valid) {

        this.service.addGroup(this.addGroup.value).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
            this.isFormSubmited = false;
            this.addGroup.reset();
            this.router.navigate(['/employer/groups/list'])
          }
        }, (err) => {
          this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
        });
      }
    }
  }

  reset() {
    this.isFormSubmited = false;
  }
}

