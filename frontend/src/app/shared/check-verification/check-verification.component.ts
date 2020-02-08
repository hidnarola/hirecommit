import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { EmployerService } from '../../views/employer/employer.service';
import { CandidateService } from '../../views/shared-components/candidates/candidate.service';
import { routes } from '../../app.routing';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check-verification',
  templateUrl: './check-verification.component.html',
  styleUrls: ['./check-verification.component.scss']
})
export class CheckVerificationComponent implements OnInit {
  userDetail: any = [];
  message: any;
  Canididate_message: any;
  constructor(
    private commonService: CommonService,
    private empService: EmployerService,
    private candidateService: CandidateService,
    private toastr: ToastrService,
    private router: Router) {
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    // if (this.userDetail.role === 'employer') {

    //   this.empService.check_approved(this.userDetail.id).subscribe(res => {
    //     this.message = res['message'];
    //     if (!(res['status'] === 1)) {
    //       this.router.navigate(['/employer/offers/list']);
    //       // this.router.navigate(['/'])
    //     }
    //   });

    // } else
    if (this.userDetail.role === 'candidate') {
      this.candidateService.check_verified(this.userDetail.id).subscribe(res => {
        this.Canididate_message = res['message'];
        if (!(res['status'] === 1)) {
          this.router.navigate(['/candidate/offers/list']);
        }
      }, (err) => {
        console.log('err => ', err);
        // this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      });
    }
  }

}
