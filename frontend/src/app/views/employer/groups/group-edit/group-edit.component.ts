import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.scss']
})
export class GroupEditComponent implements OnInit {

  public Editor = ClassicEditor;
  groupForm: FormGroup;
  communicationForm: FormGroup;
  isFormSubmitted = false;
  cancel_link = '/employer/groups/list';
  id: any;
  groupData: any = [];
  communicationData: any = [];
  panelTitle = 'View Group';
  editedData: any;
  isEdit: Boolean = false;
  arr: FormArray;
  is_communication_added: boolean = false;
  formData: FormData;
  show_spinner = false;
  constructor(
    public fb: FormBuilder,
    private service: GroupService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) {
    // show spinner
    this.spinner.show();
    // form controls
    this.groupForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      high_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      high_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      medium_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_unopened: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      low_notreplied: new FormControl('', [Validators.required, Validators.pattern(/^(3[01]|[12][0-9]|[1-9])$/)]),
      communicationFieldItems: this.fb.array([])
    });

    // check for add or edit
    if (((this.route.snapshot.url[1] &&
      this.route.snapshot.url[1].path === 'edit') || this.router.url.includes('groups/edit'))) {
      this.panelTitle = 'Edit Group';
      this.isEdit = true;
    }

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data'][0];
      // hide spinner
      this.spinner.hide();
      if (res['communication']['data'] && res['communication']['data'].length > 0) {
        this.communicationData = res['communication']['data'][0]['communication'];
      }

      // set communication
      if (this.communicationData && this.communicationData.length > 0) {
        this.is_communication_added = true;
        const _array = [];
        this.communicationData.forEach((element, index) => {
          const new_communication = {
            'communicationname': element.communicationname,
            'trigger': element.trigger,
            'priority': element.priority,
            'day': element.day,
            'message': element.message,
          };
          this.communicationFieldItems.setControl(index, this.fb.group({
            communicationname: ['', Validators.required],
            trigger: ['', Validators.required],
            priority: ['', Validators.required],
            day: ['', Validators.required],
            message: ['']
            // message: ['', Validators.required]
          }));
          _array.push(new_communication);
        });
        this.communicationData = _array;
      } else {
        console.log('no communicaiondata found => ');
        // this.add_new_communication();
      }
      // set communication
    });

  }

  ngOnInit() { }

  get f() { return this.groupForm.controls; }

  // communbication field items controls
  get communicationFieldItems() {
    return this.groupForm.get('communicationFieldItems') as FormArray;
  }

  // Update form validation
  updateValidation() {
    this.groupForm.updateValueAndValidity();
  }

  // On change of communication
  // changeCommunication(e) {
  //   console.log('e => ', e);
  //   if (e.checked) {
  //     this.add_new_communication();
  //   } else {
  //     this.communicationData = [];
  //     console.log('communicationFieldItems => ', this.communicationFieldItems);
  //     console.log('this.groupForm => ', this.groupForm);
  //     this.communicationFieldItems.setControl(0, this.fb.group({}));
  //     this.updateValidation();
  //     this.isFormSubmitted = false;
  //   }
  // }

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
      communicationname: ['', Validators.required],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      message: ['']
      // message: ['', Validators.required]
    }));

    this.communicationData.push(new_communication);
    this.updateValidation();
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

  onSubmit(valid) {
    this.isFormSubmitted = true;
    this.formData = new FormData();
    if (valid) {
      this.show_spinner = true;
      if (this.isEdit) {
        const communication_array = [];
        if (this.communicationData.length > 0) {
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
          id: this.id,
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

        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this record?',
          accept: () => {
            this.service.edit_group(this.formData).subscribe(res => {
              if (res['data']['status'] === 1) {
                this.isFormSubmitted = false;
                this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
                this.groupForm.reset();
              }
              this.router.navigate(['/employer/groups/list']);
            }, (err) => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
            });
          }
        });
      }
    }

  }

}
