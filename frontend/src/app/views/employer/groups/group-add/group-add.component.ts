import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { GroupService } from '../manage-groups.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.scss']
})
export class GroupAddComponent implements OnInit {
  public Editor = ClassicEditor;
  addGroup: FormGroup;
  communicationForm: FormGroup;
  isFormSubmitted = false;
  isSubmitted = false;
  cancel_link = '/employer/groups/list';
  groupData: any = {};
  editedData: any;
  show_communication: Boolean = false;
  communicationData: any = [];
  group_id: any;
  formData: FormData;
  show_spinner = false;
  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) {

    // form controls
    this.addGroup = this.fb.group({
      name: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      high_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      high_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)])
    });

    // add communications
    this.communicationForm = this.fb.group({
      communicationFieldItems: this.fb.array([])
    });

  }

  ngOnInit() { }

  get f() { return this.addGroup.controls; }

  // communbication field items controls
  get communicationFieldItems() {
    return this.communicationForm.get('communicationFieldItems') as FormArray;
  }

  // add new communication
  add_new_communication(data_index = null) {
    let index = 0;
    if (data_index == null) {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      } else {
        this.communicationData = [];
      }
    } else {
      if (this.communicationData && this.communicationData.length > 0) {
        index = this.communicationData.length;
      }
    }
    const new_communication = {
      'communicationname': '',
      'trigger': '',
      'priority': '',
      'day': '',
      'message': '',
    };

    this.communicationFieldItems.setControl(index, this.fb.group({
      communicationname: ['', [Validators.required, this.noWhitespaceValidator]],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]],
      message: ['', [Validators.required, this.noWhitespaceValidator]]
      // message: ['', Validators.required]
    }));

    this.communicationData.push(new_communication);
    this.communicationForm.updateValueAndValidity();
  }

  // Remove communication
  remove_communication(index: number) {
    delete this.communicationData[index];
    this.communicationFieldItems.removeAt(index);
    const array = [];
    for (let i = 0; i < this.communicationData.length; i++) {
      if (this.communicationData[i] !== undefined) {
        array.push(this.communicationData[i]);
      }
    }
    this.communicationData = array;
  }

  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  onSubmit(valid) {
    this.isFormSubmitted = true;
    if (valid) {
      this.show_spinner = true;
      this.service.addGroup(this.addGroup.value).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
          this.isFormSubmitted = false;
          this.group_id = res['data']['data']['_id'];
          // add communication
          this.add_new_communication();
          this.show_communication = true;
          this.show_spinner = false;
        }
      }, (err) => {
        this.show_spinner = false;
        this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }
  }

  //  on submit of communication
  onCommunicationSubmit(flag) {

    this.isSubmitted = true;
    this.formData = new FormData();
    if (flag) {
      if (this.show_communication) {
        const communication_array = [];
        if (this.communicationData.length > 0) {
          this.show_spinner = true;
          this.communicationData.forEach(element => {
            communication_array.push({
              communicationname: element.communicationname,
              trigger: element.trigger,
              priority: element.priority,
              day: element.day,
              message: element.message
            });
          });
        } else {
          communication_array.push();
        }

        const obj = {
          id: this.group_id,
          name: this.groupData['name'],
          high_unopened: this.groupData['high_unopened'],
          high_notreplied: this.groupData['high_notreplied'],
          medium_unopened: this.groupData['medium_unopened'],
          medium_notreplied: this.groupData['medium_notreplied'],
          low_unopened: this.groupData['low_unopened'],
          low_notreplied: this.groupData['low_notreplied'],
          data: JSON.stringify(communication_array)
        };

        for (const key in obj) {
          if (key) {
            const value = obj[key];
            this.formData.append(key, value);
          }
        }

        this.service.edit_group(this.formData).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.isFormSubmitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          }
          this.router.navigate(['/employer/groups/list']);
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
      }
    }
  }

}
