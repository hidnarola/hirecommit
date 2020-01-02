import { Injectable, ErrorHandler } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements ErrorHandler {

    router: Router;
    spinner: NgxSpinnerService;
    hostName: any = '';

    constructor(public toasterService: ToastrService) {
        // console.log('window.location.hostname => ', this.activatedRoute);
    }
    handleError(error: any): void {

        const currentUser = localStorage.getItem('token');
        // this.hostName = window.location.hostname;
        if (!currentUser && error) {
            // this.toasterService.info('Please Login Again!!', 'Session Expired!');
            // if (this.hostName === 'employer.hirecommit.com') {
            //     //     window.location.href = 'employer.hirecommit.com'
            //     // } else if (this.hostName === 'candidate.hirecommit.com') {
            //     //     window.location.href = 'candidate.hirecommit.com'
            //     // } else {
            window.location.href = 'http://localhost:4200/login';
            //     // if (this.isProd) {
            //     //     window.location.href = 'http://candidate.hirecommit.com/';
            //     // }
        }


        //     // this.toastr.info('Please Login Again', 'Session Expired!');

        //     // localStorage.clear();


        //     // this.router.navigate(['/login']);
        // }
    }
}
