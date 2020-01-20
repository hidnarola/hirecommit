import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from './services/common.service';
import { AuthGuardService } from './services/auth/auth-guard.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router, private authguard: AuthGuardService, private service: CommonService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      this.service.getvalue.subscribe(res => {
        console.log('res for popup in app component=>', res);
        if (res === true) {
          this.confirmationService.confirm({
            message: 'Are you sure you want to leave this page?',
            accept: () => {
              // this.show_spinner = true;
              // this.router.navigate([this.cancel_link]);
              // this.service.setUnSavedData(false);

            }, reject: () => {
              // this.show_spinner = false;
              // this.service.setUnSavedData(false);
              return false;
            }
          });
        }
      });
      // if (!(evt instanceof NavigationEnd)) {
      //   if ((evt instanceof NavigationStart)) {
      // this.authguard.CheckNav();
      // this.service.getunSavedData.subscribe(res => {
      // if (res) {
      //   console.log('popup=======>', res);
      //   // alert('Are you sure you want to exit the page?')
      //   this.confirmationService.confirm({
      //     message: 'Are you sure you want to leave this page?',
      //     accept: () => {
      //       // this.show_spinner = true;
      //       // this.router.navigate([this.cancel_link]);
      //       this.service.setUnSavedData(false);

      //     }, reject: () => {
      //       // this.show_spinner = false;
      //       this.service.setUnSavedData(false);
      //       return;
      //     }
      //   });
      // } else {
      //   console.log('no popup=======>', res);
      // }
      // });
      // return;
      //   }
      //   return;
      // }

      window.scrollTo(0, 0);
    });



  }

  ngAfterViewInit() {
  }

}
