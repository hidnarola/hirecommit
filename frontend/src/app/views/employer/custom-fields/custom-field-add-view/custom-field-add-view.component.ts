import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomFieldService } from '../custom-field.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';

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
  cf: any;
  data: any = {};
  isEdit = false;
  isView = false;
  show_spinner = false;
  userDetail: any;
  cancel_link = '/employer/custom_fields/list';
  constructor(
    private service: CustomFieldService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService
  ) {

    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    this.spinner.show();
    if (this.route.snapshot.data.title !== 'Add') {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
      });
      this.service.get_custom_field(this.id).subscribe(res => {
        this.spinner.hide();
        this.data = res['data'];
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });

      if (this.route.snapshot.data.title === 'Edit') {
        this.panelTitle = 'Edit Custom Field';
        this.isEdit = true;
      } else {
        this.panelTitle = 'View Custom Field';
        this.isView = true;
      }

    } else {
      this.spinner.hide();
    }
    this.addCustomFeild = new FormGroup({
      key: new FormControl('', [Validators.required, this.noWhitespaceValidator])
    });
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }


  onSubmit(valid) {
    this.submitted = true;
    this.show_spinner = true;
    if (this.id && this.id !== 0) {
      if (valid) {
        const obj = {
          'id': this.id,
          'key': this.addCustomFeild.value['key']
        };
        this.confirmationService.confirm({
          message: 'Are you sure that you want to Update this record?',
          accept: () => {
            this.submitted = false;

            this.service.edit_custom_field(obj).subscribe(res => {
              if (res['data'].status === 1) {

                this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
                if (this.userDetail.role === 'employer') {
                  this.router.navigate([this.cancel_link]);
                } else if (this.userDetail.role === 'sub-employer') {
                  this.router.navigate(['/sub_employer/custom_fields/list']);
                }

                this.addCustomFeild.reset();
              }
              this.submitted = false;
            }, (err) => {
              this.show_spinner = false;
              this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
            });
          }, reject: () => {
            this.show_spinner = false;
          }
        });
      } else {
        this.show_spinner = false;
      }
    } else {
      if (valid) {
        this.show_spinner = true;
        this.service.add_custom_field(this.addCustomFeild.value).subscribe(res => {
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate(['/sub_employer/custom_fields/list']);
            }
            this.addCustomFeild.reset();
          }
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      } else {
        this.show_spinner = false;
      }
    }
  }
  ngOnDestroy(): void {
    // console.log('this.userDetail=>', this.userDetail);

    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      if (!this.isView) {
        this.cf = this.addCustomFeild.value;
        Object.keys(this.addCustomFeild.controls).forEach((v, key) => {
          if (this.addCustomFeild.controls[v].value) {
            this.commonService.setUnSavedData(true);
            return;
          }
        });
      }

    }
  }
}
