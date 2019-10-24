import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CandidateService } from '../candidate.service';
import { CommonService } from '../../../../services/common.service';
import * as env from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss']
})
export class CandidateViewComponent implements OnInit {

  id: any;
  candidate_detail: any = [];
  approval: boolean = false;
  userDetail: any = [];
  candidate_type = 'Approved';
  email: any;
  cancel_link1 = '/admin/candidates/new_candidate';
  cancel_link2 = '/admin/candidates/approved_candidate';
  image = env.environment.imageUrl;
  buttonValue: any;
  buttonValue1: any;
  constructor(
    private router: Router,
    private service: CandidateService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private confirmationService: ConfirmationService

  ) {
    this.userDetail = this.commonService.getLoggedUserDetail();
    console.log('===>', this.activatedRoute.snapshot.data.type);

    if (this.activatedRoute.snapshot.data.type === 'new') {
      this.candidate_type = 'New';
    }

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    console.log('admin- candidate: newcandidate - detail component => ');
  }

  ngOnInit() {
    this.service.get_candidate_Detail(this.id).subscribe(res => {
      this.candidate_detail = res['data'];
      console.log('res detail', this.candidate_detail);
      this.email = this.candidate_detail['user_id']['email'];
      // if (this.candidate_detail.user_id.isAllow === false) {
      //   this.buttonValue = 'Approve';

      // } else {
      //   this.buttonValue1 = 'Cancel';
      // }
      // console.log(this.candidate_detail, this.email);
    }, (err) => {
      console.log(err);
    });
  }

  approve(id) {
    this.approval = true;
    const obj = {
      'id': id
    };
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {

        this.service.approved(obj).subscribe(res => {
          this.toastr.success(res['message'], 'Success!', { timeOut: 1000 });
          // this.rrerender();
          this.router.navigate([this.cancel_link1]);
        }, (err) => {
          console.log(err);
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 1000 });
        });
      }
    });
  }

  unapprove() {
    this.approval = false;
  }

}
