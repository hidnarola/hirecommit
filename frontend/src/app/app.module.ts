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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TermsConditionComponent } from './shared/terms-condition/terms-condition.component';
import { PrivacyPolicyComponent } from './shared/privacy-policy/privacy-policy.component';
import { RoleGuardService } from './services/auth/role-guard.service';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AuthService } from './services/auth/auth.service';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { EmailconfermationComponent } from './shared/emailconfermation/emailconfermation.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ToastrModule } from 'ngx-toastr';
import { Interceptor } from './shared/interceptor';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { environment } from '../environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
export function getToken(): string {
  return localStorage.getItem('token');
}
import { ConfirmationService } from 'primeng/api';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'ng2-tooltip-directive';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

console.log('url', environment.API_URL);

const config: SocketIoConfig = { url: `${environment.API_URL}`, options: {} };

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    HttpClientModule,
    CheckboxModule,
    FileUploadModule,
    NgxSpinnerModule,
    NgbModule,
    ConfirmDialogModule,
    TooltipModule.forRoot({
      'placement': 'bottom',
      'theme': 'light'
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: getToken
      }
    }),
    NgxCaptchaModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    SocketIoModule.forRoot(config)
  ],
  declarations: [
    AppComponent,
    P404Component,
    TermsConditionComponent,
    PrivacyPolicyComponent,
    LoginComponent,
    ForgotPasswordComponent,
    SignUpComponent,
    RegisterComponent,
    P500Component,
    EmailconfermationComponent,
    ResetPasswordComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    RoleGuardService,
    JwtHelperService, ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
