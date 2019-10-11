import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { CandidateService } from '../candidate.service';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit, OnDestroy {
  candidates:any;
  constructor(private route: Router,private service : CandidateService) { }
  // dtOptions: DataTables.Settings = {};
  // dtTrigger = new Subject();
  ngOnInit() {
    // this.dtTrigger.next();
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

    this.bind();
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 10
    // };


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

  ngOnDestroy = () => {
    // this.dtTrigger.unsubscribe();
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

   public bind(){
     this.service.get_candidate().subscribe(res => {
            this.candidates = res['data'];
       console.log('>>',this.candidates);
            this.candidates = this.candidates.filter(x => x.user_id.isAllow === true)
            // this.candidates = this.candidates.filter(x => x.is_del === false)
            
     })
   }
}

