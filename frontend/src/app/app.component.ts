import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from './services/common.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { Observable } from 'rxjs';
import { RoleGuardService } from './services/auth/role-guard.service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostListener('window:beforeunload')
  canLeavePage() {
    return 'Are you sure you want to leave this page ?';
  }
  constructor(
    private router: Router, private roleGuard: RoleGuardService, private service: CommonService,
    private confirmationService: ConfirmationService) { }

  ngOnInit() {


    this.router.events.subscribe((evt) => {
      window.scrollTo(0, 0);
    });



  }

  ngAfterViewInit() {
  }

}
