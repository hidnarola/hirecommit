import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from './services/common.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private router: Router, private confirmationService: ConfirmationService, private service: CommonService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      //   if (!(evt instanceof NavigationEnd)) {
      //     if ((evt instanceof NavigationStart)) {
      //       this.service.getunSavedData.subscribe(res => {
      //         if (res) {
      //           console.log('popup=======>', res);

      //           this.confirmationService.confirm({
      //             message: 'Are you sure you want to cancel?',
      //             accept: () => {
      //               // this.show_spinner = true;
      //               // this.router.navigate([this.cancel_link]);
      //               this.service.setUnSavedData(false);

      //             }, reject: () => {
      //               // this.show_spinner = false;
      //               this.service.setUnSavedData(false);
      //               return;
      //             }
      //           });
      //         } else {
      //           console.log('no popup=======>', res);
      //         }
      //       });
      //       return;
      //     }
      //     return;
      //   }

      window.scrollTo(0, 0);
    });



  }

  ngAfterViewInit() {
  }

}
