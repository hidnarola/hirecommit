import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class CustomFieldAddViewComponent implements OnInit, OnDestroy {

  submitted = false;
  panelTitle = 'Add Custom Field';
  buttonTitle = 'Add';
  addCustomFeild: FormGroup;
  id: any;
  istouchedArray = [];
  cf: any;
  data: any = {};
  isEdit = false;
  isView = false;
  show_spinner = false;
  userDetail: any;
  cancel_link = '/employer/custom_fields/list';
  currentUrl = '';
  constructor(
    private service: CustomFieldService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private commonService: CommonService
  ) {
    this.currentUrl = this.router.url;
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    this.spinner.show();

    if (this.route.snapshot.data.title !== 'Add') {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
      });

      // this.formInit();
      // this.getCustomField();
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

    this.commonService.getuserdata.subscribe(res => {
      this.formInit();
      this.getCustomField(this.id).then((resp: any) => {

        if (res.key) {
          if (this.isEdit) {
            this.data = { ...resp, ...res };
          } else {
            this.data = { ...res };
          }
        } else if (resp) {
          this.data = { ...resp };
        } else if (!res.key && !resp) {
          this.data = '';
        }
      });

    });
  }
  formInit = () => {
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

  Cancel() {
    this.submitted = true;
    this.commonService.setuserData('');
    if (this.userDetail.role === 'employer') {
      this.router.navigate([this.cancel_link]);
    } else if (this.userDetail.role === 'sub-employer') {
      this.router.navigate(['/sub_employer/custom_fields/list']);
    }
  }

  async getCustomField(id: string) {
    if (this.id) {
      id = this.id;
      this.panelTitle = 'Edit Custom Field';
      return new Promise((pass, fail) => {
        this.service.get_custom_field(id).subscribe(res => {
          this.spinner.hide();
          this.data = res['data'];
          pass(res[`data`]);
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          fail(err);
        });
      });
    } else {
      this.data = {
        _id: null,
        key: null,
        // country: null,
      };
      this.panelTitle = 'Add Custom Field';
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
                this.commonService.setuserData('');
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
            this.commonService.setuserData('');
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
  isTouched(value) {
    if (value) {
      this.istouchedArray.push(value);
    }
  }
  ngOnDestroy(): void {
    if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
      if (!this.isView) {
        this.data = this.addCustomFeild.value;
        if (this.isEdit) {
          if (this.istouchedArray.length > 0) {
            if (this.data.key) {
              this.commonService.setuserData(this.data);
              this.router.navigate([this.currentUrl]);
              this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });

            }
          } else if (this.istouchedArray.length == 0) {
            this.commonService.setuserData('');
          }
        } else {
          if (this.data.key) {
            this.commonService.setuserData(this.data);
            this.router.navigate([this.currentUrl]);
            this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });

          }
        }

      }

    }
  }
}
