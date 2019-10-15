import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newcandidate-list',
  templateUrl: './newcandidate-list.component.html',
  styleUrls: ['./newcandidate-list.component.scss']
})
export class NewcandidateListComponent implements OnInit {
  candidates: any;

  constructor(private service: CandidateService, private route: Router) { }

  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });


    this.bind();
  }

  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    // do next particular records like  101 - 200 rows.
    // we are calling to api

    console.log('next clicked');
  }
  previousButtonClickEvent(): void {
    // do previous particular the records like  0 - 100 rows.
    // we are calling to API
  }

  onApproved(id) {
    this.service.approved_candidate(id).subscribe(res => {
      console.log('approved!!!');
      this.bind();
    })
  }
  onDelete(id) {
    this.service.deactivate_candidate(id).subscribe(res => {
      console.log("deactivate!!");
      this.bind();
    })

  }
  detail(id) {
    this.route.navigate(['admin/candidate_manage/candidate_detail/' + id])


  }


public bind() {
  this.service.new_request().subscribe(res => {
    this.candidates = res;
    console.log('>>', res);
    
    })
  }

}
