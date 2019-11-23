import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../../employer.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as  moment from 'moment';
@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.component.html',
  styleUrls: ['./report-history.component.scss']
})
export class ReportHistoryComponent implements OnInit {
  id: any;
  candidate: any = {};
  employer: any = [];
  offer: any = [];
  history: any[] = [];
  moment: any;
  constructor(private service: EmployerService,
    private route: ActivatedRoute, ) {
  }

  ngOnInit() {
    this.moment = moment;
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });

    this.service.history(this.id).subscribe(res => {
      const history = res['data'];
      this.history = history;
      this.candidate = history['candidate'];
      this.employer = history['employer'];
    });

  }


}
