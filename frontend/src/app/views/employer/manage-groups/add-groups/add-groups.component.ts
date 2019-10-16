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
  _name: any;
  title: string;
  cancel_link = '/employer/groups/list';

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.service.get_detail(this.id).subscribe(res => {
      this._name = res['data']['data'];
      console.log('name', this._name);
    });

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
      message: ['']
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
