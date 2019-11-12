import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EmployerService } from '../employer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-employer-view',
  templateUrl: './employer-view.component.html',
  styleUrls: ['./employer-view.component.scss']
})
export class EmployerViewComponent implements OnInit {

  id: any;
  employer_detail: any = [];
  name: any = [];
  buttonValue: any;
  buttonValue1: String;
  approval: boolean = false;
  // cancel_link = '/admin/employers/list';
  cancel_link1 = '/admin/employers/new_employer';
  cancel_link2 = '/admin/employers/approved_employer';
  employer_type = 'Approved';
  userDetail: any = [];
  email: any[];
  businesstype: any;
  country: any;
  website: any;
  companyName: any;
  bussinessType: any;
  constructor(
    private router: Router,
    private service: EmployerService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService,
  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();

    if (this.route.snapshot.data.type === 'new') {
      this.employer_type = 'New';
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employer_detail = res['data'];
      this.email = res['data']['user_id']['email'];
      this.country = res['data']['businesstype']['country'];
      this.businesstype = res['data']['businesstype']['name'];
      this.website = res['data']['website'];
      this.companyName = res['data']['companyname']
      this.bussinessType = res['data']['businesstype']['name']
      this.name = this.employer_detail.username;
      this.name = this.name.split(' ');
      // console.log(this.name);
      console.log('employer_detail', this.employer_detail.user_id);

      // console.log('this.employer', this.employer_detail);

      if (this.employer_detail.user_id.isAllow === false) {
        this.buttonValue = 'Approve';

      } else {
        this.buttonValue1 = 'Cancel';
      }
    });
  }

  // aprrove(id) {
  //   console.log('get id?', id);

  //   const obj = {
  //     'id': id
  //   };
  //   this.service.approved(obj).subscribe(res => {
  //     this.toastr.success(res['message'], 'Success!', { timeOut: 1000 });
  //     this.cancel_link1;
  //   }, (err) => {
  //     console.log(err);
  //     this.toastr.error(err['error']['message'], 'Error!', { timeOut: 1000 });
  //   });
  // }

  onApprove(id) {
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.service.approved(obj).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 1000 });
          this.router.navigate([this.cancel_link1]);
        }, (err) => {
          console.log(err);
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 1000 });
        });
      }
    });
  }

  onUnapproved(id) {
    this.service.deactivate_employer(id).subscribe(res => {
      this.router.navigate([this.cancel_link1]);
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
