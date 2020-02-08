import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EmployerService } from '../employer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { EmployerService as emp } from '../../../employer/employer.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-employer-view',
  templateUrl: './employer-view.component.html',
  styleUrls: ['./employer-view.component.scss']
})
export class EmployerViewComponent implements OnInit {
  empForm: FormGroup;
  id: any;
  employer_detail: any = [];
  name: any;
  username: any = [];
  buttonValue: any;
  buttonValue1: String;
  approval: boolean = false;

  obj: any;
  show_spinner = false;
  // cancel_link = '/admin/employers/list';
  cancel_link1 = '/admin/employers/new_employer';
  cancel_link2 = '/admin/employers/approved_employer';
  employer_type = 'Approved';
  userDetail: any = [];
  email: any[];
  businesstype: any;
  country: any;
  website: any;
  contactno: any;
  companyName: any;
  is_Edit: Boolean = false;
  is_View: Boolean = false;
  submitted = false;
  bussinessType: any;
  constructor(
    private router: Router,
    private service: EmployerService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private employerService: emp,
    private confirmationService: ConfirmationService,
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();

    if (this.route.snapshot.data.type === 'new') {
      this.employer_type = 'New';
    }
    if (this.route.snapshot.url[1].path === 'edit') {
      this.is_Edit = true;
    } else if (this.route.snapshot.url[1].path === 'view') {
      this.is_View = true;
    }

    this.empForm = new FormGroup({
      companyname: new FormControl(''),
      website: new FormControl(''),
      country: new FormControl(''),
      bussinesstype: new FormControl(''),
      countrycode: new FormControl(''),
      username: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      email: new FormControl('', [Validators.required,
      Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]
      ),
      contactno: new FormControl('', Validators.compose([Validators.required,
      Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/)
      ])),
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

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.getDetails();
  }

  getDetails() {
    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employer_detail = res['data'];
      this.email = res['data']['user_id']['email'];
      this.country = res['data']['businesstype']['country'];
      this.businesstype = res['data']['businesstype']['name'];
      this.website = res['data']['website'];
      this.contactno = res['data']['contactno'];
      this.companyName = res['data']['companyname'];
      this.bussinessType = res['data']['businesstype']['name'];
      this.username = this.employer_detail.username;
      // this.name = this.username.split(' ');
      // console.log(this.name);

      // console.log('this.employer', this.employer_detail);

      if (this.employer_detail.user_id.isAllow === false) {
        this.buttonValue = 'Approve';

      } else {
        this.buttonValue1 = 'Cancel';
      }
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }
  // aprrove(id) {
  //   console.log('get id?', id);

  //   const obj = {
  //     'id': id
  //   };
  //   this.service.approved(obj).subscribe(res => {
  //     this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
  //     this.cancel_link1;
  //   }, (err) => {
  //     console.log(err);
  //     this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
  //   });
  // }

  Update(valid, id) {
    this.submitted = true;
    this.show_spinner = true;
    if (valid) {

      this.obj = {
        'user_id': id,
        'username': this.username,
        'email': this.email,
        'contactno': this.contactno
      };
      this.confirmationService.confirm({
        message: 'Are you sure that you want to update Employer Profile?',
        accept: () => {

          this.service.update_employer(this.obj).subscribe(res => {
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.show_spinner = false;
            this.getDetails();
            this.router.navigate([this.cancel_link2]);
          }, err => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });

        }, reject: () => {
          this.show_spinner = false;
        }
      });
    }
    else {
      this.show_spinner = false;
    }
  }

  checkEmail() {
    this.commonService.email_exists({ 'email': this.empForm.value.email, 'user_id': this.employer_detail.user_id._id }).subscribe(res => {
    }, (err) => {
      this.empForm.controls['email'].setErrors({ 'isExist': true });
      this.empForm.updateValueAndValidity();
    });
  }

  onApprove(id) {
    this.show_spinner = true;
    // document.getElementById('approve').setAttribute('disabled', 'true');
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({

      message: 'Are you sure that you want to Approve this Employer?',
      accept: () => {

        this.service.aprroved_employer(obj).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });

          this.router.navigate([this.cancel_link1]);
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      }, reject: () => {
        this.show_spinner = false;
        // document.getElementById('approve').removeAttribute('disabled');
      }
    });
  }

  onUnapproved(id) {
    this.service.deactivate_employer(id).subscribe(res => {
      this.router.navigate([this.cancel_link1]);
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  check(routes) {
    if (routes === false) {
      this.router.navigate([this.cancel_link1]);
    } else {
      this.router.navigate(['/admin/employers/view']);
    }
  }



}
