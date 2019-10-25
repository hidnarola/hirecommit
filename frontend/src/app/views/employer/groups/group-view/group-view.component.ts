import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private service: GroupService,
  ) {
    // show spinner
    this.spinner.show();

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data'][0];
      console.log('this.groupData => ', this.groupData);

      // hide spinner
      this.spinner.hide();
      if (res['communication']['data'] && res['communication']['data'].length > 0) {
        this.communicationData = res['communication']['data'][0]['communication'];
      }
      console.log('communicationData => ', this.communicationData);
    });

  }

  ngOnInit() {
  }

}
