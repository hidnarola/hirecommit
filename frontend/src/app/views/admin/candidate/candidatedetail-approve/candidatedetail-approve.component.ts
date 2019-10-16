import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-candidatedetail-approve',
  templateUrl: './candidatedetail-approve.component.html',
  styleUrls: ['./candidatedetail-approve.component.scss']
})
export class CandidatedetailApproveComponent implements OnInit {

  candidates: any;
  id: any;
  form = false;
  buttonValue: any;
  buttonValue1: String;

  constructor(
    private service: CandidateService,
    private router: Router,
    private route: ActivatedRoute) {
    console.log('admin- candidate: candidatedetail-approve component => ');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.bind();
  }

  cancel() { }

  public bind() {
    this.service.candidate_detail(this.id).subscribe(res => {
      this.candidates = res['data'];
      this.form = true;
      if (this.candidates.user_id.isAllow === false) {
        this.buttonValue = 'Approve';
        this.buttonValue1 = 'unapprove';
      } else {
        this.buttonValue1 = 'Cancel';
      }
      console.log('img', this.candidates);

    });
  }

  check(routes) {
    if (routes === false) {
      this.router.navigate(['/admin/candidates/new_candidate']);
    } else {
      this.router.navigate(['/admin/candidates/approve_candidate']);
    }
  }

  onApproved(id) {
    this.service.approved_candidate(id).subscribe(res => {
      console.log('approved!!!');
      this.bind();
      this.router.navigate(['/admin/candidates/approve_candidate']);
    });
  }

  onUnapproved(id) {
    console.log(id);
    this.service.deactivate_candidate(id).subscribe(res => {
      console.log('Deleted!!');
      this.router.navigate(['/admin/candidates/new_candidate']);
    });
  }

}
