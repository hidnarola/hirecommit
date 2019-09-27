import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
import { EmployerService } from '../../employer.service';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.scss']
})
export class AddGroupsComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private service: EmployerService) { }

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

  onSubmit(valid) {
    this.submitted = true;
    const id = '5d89fb9601881f47c02cb63c' ;
    if (valid) {
      this.service.add_communication(this.myForm.controls.arr.value, id).subscribe(res => {
        // this.submitted = true;
        this.router.navigate(['/employer/manage_group/view_group']);
      });
    }
    console.log(this.myForm.value);

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
