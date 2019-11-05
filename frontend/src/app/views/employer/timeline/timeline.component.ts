import { Component, OnInit } from '@angular/core';
import { EmployerService } from '../employer.service';
import { OfferService } from '../../shared-components/offers/offer.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as  moment from 'moment';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  id: any;
  candidate: any = {};
  employer: any = [];
  offer: any = [];
  history: any[] = [];
  moment: any;
  constructor(private service: OfferService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.moment = moment;
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.service.history(this.id).subscribe(res => {
      const history = res['data'];

      this.history = history;
      console.log('history', res['data']);
      this.candidate = history['candidate'];
      this.employer = history['employer'];
      // this.offer = history;

      // this.date = history.createdAt.split('T')[0];
      // this.date = moment(history.createdAt).fromNow();

      console.log('history', this.candidate);
      console.log('history', this.employer);

      console.log('offer', this.history);
    })

  }



}
