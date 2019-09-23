import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

import { AppRoutingModule } from './app.routing';
import { P404Component } from './shared/error/404.component';
import { P500Component } from './shared/error/500.component';
import { LoginComponent } from './shared/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './shared/forgot-password/forgot-password.component';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
import { RegisterComponent } from './shared/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { RoleGuardService } from './services/auth/role-guard.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { JwtHelperService , JwtModule } from '@auth0/angular-jwt';
import { EmailconfermationComponent } from './shared/emailconfermation/emailconfermation.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ToastrModule } from 'ngx-toastr';

export function getToken(): string {
  return localStorage.getItem('token');
}
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
          tokenGetter: getToken
      }
  }),
  NgxCaptchaModule,
  ToastrModule.forRoot({
    positionClass: 'toast-bottom-right'
  })
  ],
  declarations: [
    AppComponent,
    P404Component,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    RegisterComponent,
    P500Component,
    EmailconfermationComponent,
    ResetPasswordComponent
  ],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, AuthService, AuthGuardService, RoleGuardService, JwtHelperService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
