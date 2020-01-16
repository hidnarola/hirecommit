import { Injectable, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../services/common.service';
import { environment } from '../../environments/environment';
import { log } from 'util';
@Injectable()
export class ErrorInterceptor implements ErrorHandler {

    router: Router;
    spinner: NgxSpinnerService;
    hostName: any = '';
    constructor(public toasterService: ToastrService) {
        this.hostName = window.location.href;
    }
    handleError(error: any): void {

        const currentUser = localStorage.getItem('token');
        // this.hostName = window.location.hostname;
        if (!currentUser && error) {
            if (this.hostName.includes('admin')) {
                window.location.href = environment.mainURL + '/login';
            } else if (this.hostName.includes('candidate')) {
                window.location.href = environment.candidateURL;
            } else if (this.hostName.includes('employer')) {
                window.location.href = environment.employerURL;
            } else if (this.hostName.includes('sub_employer')) {
                window.location.href = environment.employerURL;
            } else {
                window.location.href = environment.mainURL + 'login';
            }
            // this.toasterService.info('Please Login Again!!', 'Session Expired!');
            // if (this.hostName === 'employer.hirecommit.com') {
            //     //     window.location.href = 'employer.hirecommit.com'
            //     // } else if (this.hostName === 'candidate.hirecommit.com') {
            //     //     window.location.href = 'candidate.hirecommit.com'
            //     // } else {
            // window.location.href = 'http://localhost:4200/login';
            //     // if (this.isProd) {
            //     //     window.location.href = 'http://candidate.hirecommit.com/';
            //     // }
        } else {
            // // console.log('error=>', error);

            // window.location.href = environment.mainURL + 'login';
        }


        //     // this.toastr.info('Please Login Again', 'Session Expired!');

        //     // localStorage.clear();


        //     // this.router.navigate(['/login']);
        // }
    }
}
