import { Component, OnInit } from '@angular/core';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-communication-add-edit',
  templateUrl: './communication-add-edit.component.html',
  styleUrls: ['./communication-add-edit.component.scss']
})
export class CommunicationAddEditComponent implements OnInit {

  public Editor = ClassicEditor;
  myForm: FormGroup;
  arr: FormArray;
  id: any;
  value = false;
  submitted = false;
  _name: any;
  title: string;
  cancel_link = '/employer/groups/list';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: GroupService,
    private route: ActivatedRoute
  ) {
    console.log('employer - groups : add-groups component => ');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.get_detail(this.id).subscribe(res => {
      this._name = res['data']['data'];
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
