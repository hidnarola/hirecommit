import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { GroupService } from '../manage-groups.service';

@Component({
  selector: 'app-groups-details',
  templateUrl: './groups-details.component.html',
  styleUrls: ['./groups-details.component.scss']
})
export class GroupsDetailsComponent implements OnInit {
  id: any;
  _name: any;
  _details: any = [];
  data: any;
  viewform = false;
  communication: any = [];
  constructor(private router: Router, private route: ActivatedRoute, private service: GroupService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.service.get_detail(this.id).subscribe(res => {
      this._name = res['data']['data'];
      this.viewform = true;
      console.log('name', this._name);

    })

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
      console.log('_details', this.data);


    })
  }

  cancel() {
    this.router.navigate(['/employer/groups/list']);
  }

  edit() {
    this.router.navigate(['/employer/groups/add_group']);
  }

  onclick() {

  }

}
