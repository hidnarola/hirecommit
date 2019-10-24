import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomFieldService } from '../custom-field.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-custom-field-add-view',
  templateUrl: './custom-field-add-view.component.html',
  styleUrls: ['./custom-field-add-view.component.scss']
})
export class CustomFieldAddViewComponent implements OnInit {

  submitted = false;
  panelTitle = 'Add Custom Field';
  buttonTitle = 'Add';
  addCustomFeild: FormGroup;
  id: any;
  data: any = {};
  isEdit = false;

  constructor(
    private service: CustomFieldService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.isEdit = true;
    });
    this.service.get_custom_field(this.id).subscribe(res => {
      this.data = res['data'];
      this.panelTitle = 'Edit Custom Field';
      this.buttonTitle = 'Update';
    });
    this.addCustomFeild = new FormGroup({
      key: new FormControl('', [Validators.required])
    });
  }

  onSubmit(valid) {
    this.submitted = true;
    if (this.id && this.id !== 0) {
      const obj = {
        'id': this.id,
        'key': this.addCustomFeild.value['key']
      };
      this.service.edit_custom_field(obj).subscribe(res => {
        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.addCustomFeild.reset();
        }
        this.router.navigate(['/employer/custom_fields/list']);
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    } else {
      if (valid) {
        this.service.add_custom_field(this.addCustomFeild.value).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addCustomFeild.reset();
          }
          this.router.navigate(['/employer/custom_fields/list']);
        }, (err) => {
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
      }
    }
  }

}
