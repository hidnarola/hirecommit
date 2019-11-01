import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent implements OnInit {

  public Editor = ClassicEditor;
  id: any;
  groupData: any = [];
  communicationData: any = [];
  cancel_link = '/employer/groups/list'
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private service: GroupService,
    private router: Router
  ) {
    // show spinner
    this.spinner.show();

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data'][0];

      // hide spinner
      this.spinner.hide();
      if (res['communication']['data'] && res['communication']['data'].length > 0) {
        this.communicationData = res['communication']['data'][0]['communication'];
      }

    });
  }

  ngOnInit() {
  }


}
