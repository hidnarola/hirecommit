import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-emailconfermation',
  templateUrl: './emailconfermation.component.html',
  styleUrls: ['./emailconfermation.component.scss']
})
export class EmailconfermationComponent implements OnInit {

  params_token: any;

  // tslint:disable-next-line: max-line-length
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CommonService,
    private toastr: ToastrService
  ) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
    });

    const that = this;
    this.service.verify_email(this.params_token).subscribe(res => {
      if (res['status'] === 1) {

        this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
        Swal.fire({
          type: 'success',
          text: 'Thank you for verifying your email'

        }).then(function (isConf) {
          if (res['role'] === 'candidate') {
            window.location.href = environment.candidateURL + '/login';
          } else if (res['role'] === 'employer') {
            window.location.href = environment.employerURL + '/login';
          } else if (res['role'] === 'sub-employer') {
            window.location.href = environment.employerURL + '/login';
          } else {
            that.router.navigate(['/login']);
          }
        });

      }
    }, (err) => {
      this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
      this.router.navigate(['/login']);
    });
  }

  ngOnInit() {
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   this.params_token = params;
    // });
  }

  // confirm() {
  //   this.service.verify_email(this.params_token).subscribe(res => {
  //     if (res['status'] === 1) {
  //       this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
  //       this.router.navigate(['/login']);
  //     }
  //   }, (err) => {
  //     this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
  //   });
  // }

}
