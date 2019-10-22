import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CandidateService } from '../candidate.service';
import { CommonService } from '../../../../services/common.service';

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
  cancel_link1 = '/admin/candidates/new_candidate';
  cancel_link2 = '/admin/candidates/approved_candidate';



  constructor(
    private router: Router,
    private service: CandidateService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute
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
      // console.log(this.candidate_detail);
    }, (err) => {
      console.log(err);
    });
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }

}
