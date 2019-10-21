import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GroupService } from '../manage-groups.service';

@Component({
  selector: 'app-communication-view',
  templateUrl: './communication-view.component.html',
  styleUrls: ['./communication-view.component.scss']
})
export class CommunicationViewComponent implements OnInit {

  id: any;
  _name: any;
  _details: any = [];
  data: any;
  communication: any = [];
  cancel_link = '/employer/groups/list';

  constructor
    (private router: Router,
      private route: ActivatedRoute,
      private service: GroupService
    ) {
    console.log('employer - groups : groups-details component => ');
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.service.get_detail(this.id).subscribe(res => {
      this._name = res['data']['data'];
      console.log('>>', this._name);

    });
    this.service.get_communication_detail(this.id).subscribe(res => {
      this._details = res['data']['data'];
      this.data = this._details;
      this._details.forEach(element => {
        if (element.communication.length > 0) {
          element.communication.forEach(com => {
            this.communication.push(com);
          });
        }
      });
    });
  }

  //   this.router.navigate(['/employer/groups/list']);
  // }

  edit(flag) { }

  onclick() { }

}
