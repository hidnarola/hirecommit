import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidatedetail-approve',
  templateUrl: './candidatedetail-approve.component.html',
  styleUrls: ['./candidatedetail-approve.component.scss']
})
export class CandidatedetailApproveComponent implements OnInit {
  candidates: any;
  constructor(private service : CandidateService,private router : Router) { }

  ngOnInit() {
  }

  cancel() {
  }
 public bind(){
   this.service.get_candidate().subscribe(res => {
     this.candidates = res['data'];
     this.candidates = this.candidates.filter(x => x.is_del === false);
   })
 }
}
