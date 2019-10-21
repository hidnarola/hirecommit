import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {

  public Editor = ClassicEditor;
  groupForm: FormGroup;
  communicationForm: FormGroup;
  isFormSubmited = false;
  cancel_link = '/employer/groups/list';
  id: any;
  groupData: any = [];
  communicationData: any = [];
  panelTitle = 'View Group';
  editedData: any;
  isEdit: Boolean = false;
  arr: FormArray;
  dynamic_address = 0;

  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    // form controls
    this.groupForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      high_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      high_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      customfieldItem: this.fb.array([])
    });

    // check for add or edit
    if (((this.route.snapshot.url[1] &&
      this.route.snapshot.url[1].path === 'edit') || this.router.url.includes('groups/edit'))) {
      this.panelTitle = 'Edit Group';
      this.isEdit = true;
    }

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      console.log('res => ', res, res['data']['data']);
      this.groupData = res['data']['data'][0];
      this.communicationData = res['communication']['data'];
      console.log('this.groupData => ', this.groupData, this.communicationData);
    });
    // this.createItem();
  }

  ngOnInit() { }

  get f() { return this.groupForm.controls; }
  // delivery property get method
  get customfieldItem() {
    return this.groupForm.get('customfieldItem') as FormArray;
  }

  addItem() {
    let index = 0;
    if (this.communicationData) {
      index = this.communicationData.length;
    } else {
      this.communicationData = [];
    }
    const new_location = {
      'communicationname': index === 0 ? '' : this.communicationData[index - 1].communicationname,
      'trigger': index === 0 ? '' : this.communicationData[index - 1].trigger,
      'priority': index === 0 ? '' : this.communicationData[index - 1].priority,
      'day': index === 0 ? '' : this.communicationData[index - 1].day,
      'message': index === 0 ? '' : this.communicationData[index - 1].message,
    };
    this.dynamic_address = index;
    this.customfieldItem.setControl(index, this.fb.group({
      communicationname: ['', Validators.required],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      message: ['', Validators.required]
    }));

    this.communicationData.push(new_location);
    this.groupForm.updateValueAndValidity();
  }

  // Remove delivery location
  removeItem(id: number) {
    delete this.communicationData[id];
    this.customfieldItem.removeAt(id);
    const array = [];
    for (let i = 0; i < this.communicationData.length; i++) {
      if (this.communicationData[i] !== undefined) {
        array.push(this.communicationData[i]);
      }
    }
    this.communicationData = array;
    this.dynamic_address = this.dynamic_address - 1;
  }

  // createItem() {
  //   this.customfieldItem.setControl(index, this.fb.group({
  //     communicationname: ['', Validators.required],
  //     trigger: ['', Validators.required],
  //     priority: ['', Validators.required],
  //     day: ['', Validators.required],
  //     message: ['', Validators.required]
  //   }));
  // }

  // addItem(i) {
  //   this.arr = this.communicationForm.get('arr') as FormArray;
  //   this.arr.push(this.createItem());
  // }

  // removeItem(i) {
  //   this.arr = this.communicationForm.get('arr') as FormArray;
  //   this.arr.removeAt(this.communicationForm[i]);
  // }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  onSubmit(valid) {
    console.log('valid => ', valid);
    this.isFormSubmited = true;
    if (valid) {
      if (this.isEdit) {
        const obj = {
          id: this.id,
          name: this.groupData['name'],
          high_unopened: this.groupData['high_unopened'],
          high_notreplied: this.groupData['high_notreplied'],
          medium_unopened: this.groupData['medium_unopened'],
          medium_notreplied: this.groupData['medium_notreplied'],
          low_unopened: this.groupData['low_unopened'],
          low_notreplied: this.groupData['low_notreplied'],
        };

        this.service.edit_group(obj).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.isFormSubmited = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.groupForm.reset();
          }
          this.router.navigate(['/employer/groups/list']);
        }, (err) => {
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
      }
    }

  }



  editGroup(flag) {

  }
}
