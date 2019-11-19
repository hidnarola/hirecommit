import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { EmployerService } from '../../views/employer/employer.service';

@Component({
  selector: 'app-check-verification',
  templateUrl: './check-verification.component.html',
  styleUrls: ['./check-verification.component.scss']
})
export class CheckVerificationComponent implements OnInit {
  userDetail: any = [];
  message: any;
  constructor(
    private commonService: CommonService,
    private empService: EmployerService) {
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    console.log('this.userDetail=>', this.userDetail);
    this.empService.check_approved(this.userDetail.id).subscribe(res => {
      this.message = res['message']
    })
  }

}
