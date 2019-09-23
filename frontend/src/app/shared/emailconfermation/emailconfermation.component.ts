import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-emailconfermation',
  templateUrl: './emailconfermation.component.html',
  styleUrls: ['./emailconfermation.component.scss']
})
export class EmailconfermationComponent implements OnInit {
  params_token: any;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private service: CommonService, private toastr: ToastrService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.params_token = params;
    });
  }

  confirm () {
    this.service.verify_email(this.params_token).subscribe(res => {
      if (res['status'] === 1) {
        this.toastr.success(res['message'], 'Success!', {timeOut: 3000});
        this.router.navigate(['/login']);
      }
    }, (err) => {
      this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
    });
  }
}
