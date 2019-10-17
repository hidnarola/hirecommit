import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../manage-groups.service';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss']
})
export class AddGroupsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private service: GroupService, private route: ActivatedRoute) { }

  public Editor = ClassicEditor;
  myForm: FormGroup;
  arr: FormArray;
  id: any;
  value = false;
  submitted = false;
  details: any = {};
  _name: any = {};
  isEdit = false;
  title: string;
  id1: any;
  cancel_link = '/employer/groups/list'
  Triggers = [
    { label: 'Select', value: '' },
    { label: 'After Offer', value: 'After Offer' },
    { label: 'Before Joining', value: 'Before Joining' },
    { label: 'Before Expiry', value: 'Before Expiry' },
    { label: 'After Expiry', value: 'After Expiry' },
    { label: 'After Joining', value: 'After Joining' }
  ];

  Priority = [
    { label: 'Select', value: '' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.isEdit = true;

    });

    this.service.get_detail(this.id).subscribe(res => {
      this._name = res['data']['data'];
      this._name = this._name[0];
    });

    this.service.get_communication_detail(this.id).subscribe(res => {
      this.details = res['data']['data'][0];
      console.log('details >> ', this.details);

    })



    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });
  }



  public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  onSubmit(valid) {
    this.submitted = true;
    if (this.isEdit) {

    }

    if (valid) {
      this.service.add_communication(this.myForm.controls.arr.value, this.id).subscribe(res => {
        this.submitted = false;
        this.router.navigate([this.cancel_link]);
      });
    }
  }


  createItem() {
    return this.fb.group({
      communicationname: ['', Validators.required],
      trigger: ['', Validators.required],
      priority: ['', Validators.required],
      day: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  get f() { return this.myForm.controls.arr['controls']; }

  addItem(i) {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i) {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.removeAt(this.myForm[i]);
  }

}
