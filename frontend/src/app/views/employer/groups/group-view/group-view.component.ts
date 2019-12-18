import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../manage-groups.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

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
  cancel_link = '/employer/groups/list';
  userDetail: any;
  Trigger_Option = [
    { label: 'Select Offer Type', value: '' },
    { label: 'Before Joining', value: 'beforeJoining' },
    { label: 'After Joining', value: 'afterJoining' },
    { label: 'After Offer', value: 'afterOffer' },
    { label: 'Before Expiry', value: 'beforeExpiry' },
    { label: 'After Expiry', value: 'afterExpiry' },
    { label: 'After Acceptance', value: 'afterAcceptance' }

  ];
  constructor(
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private service: GroupService,
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService
  ) {

    this.userDetail = this.commonService.getLoggedUserDetail();
    // show spinner
    this.spinner.show();

    this.id = this.route.snapshot.params.id;
    this.service.get_detail(this.id).subscribe(res => {
      this.groupData = res['data']['data'][0];
      // hide spinner
      this.spinner.hide();
      if (res['communication']['data'] && res['communication']['data'].length > 0) {
        this.communicationData = res['communication']['data'][0]['communication'];

        if (res['communication']['data'][0]['communication'].length > 0) {
          res['communication']['data'][0]['communication'].forEach(element => {
            element.trigger =
              (this.Trigger_Option.find(o => o.value === element.trigger).label);
          });
        }
      }
    }, (err) => {
      this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
    });
  }

  ngOnInit() {
  }


}
