import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss']
})
export class AddGroupsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router) { }

  public Editor = ClassicEditor;
  myForm: FormGroup;
  arr: FormArray;

  value = false;
  submitted = false;

  onClose() {
    this.router.navigate(['/employer/manage_group/view_group']);
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()])
    });
  }

  public onReady( editor ) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
}
  // get f() { return this.myForm.controls.arr['controls']}

  onSubmit() {
    this.submitted = true;
    if (this.myForm.invalid) {
      console.log(this.myForm.controls.arr['controls'][0]);
      return;
  }
    console.log(this.myForm.value);
  }

  createItem() {
    return this.fb.group({
      name: ['', Validators.required],
      trigger: ['', [Validators.required]],
      day: ['', Validators.required],
      message: ['Enter Message']
    });
  }

  addItem(i) {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(i) {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.removeAt(this.myForm[i]);
  }

}
