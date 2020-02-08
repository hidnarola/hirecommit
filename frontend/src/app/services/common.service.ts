import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import { AES, enc } from 'crypto-ts';
import * as  moment from 'moment';
import { EmployerService } from '../views/employer/employer.service';
import { CandidateService } from '../views/shared-components/candidates/candidate.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  details: any;
  data: {
    value: false,
    url: string,
    newurl: string
  }

  // profile_data: any = [];
  candidate_Profile: any = [];
  userformdata: any = {};
  // private url = 'http://localhost:3000';
  private url = env.environment.API_URL;
  private secretKey = 'myhardpassword';
  private profileDetail = new BehaviorSubject(null);
  public changed_profile_detail = new BehaviorSubject(null);
  private firstLoginDetail = new BehaviorSubject(null);
  private unSavedData = new BehaviorSubject(this.data);
  private value_Popup = new BehaviorSubject(false);
  private checkDestroy = new BehaviorSubject(false);

  private setuserdata = new BehaviorSubject(this.userformdata);


  getprofileDetail = this.profileDetail.asObservable();
  getChangedProfileDetail = this.changed_profile_detail.asObservable();
  getFirstLogin = this.firstLoginDetail.asObservable();
  getunSavedData = this.unSavedData.asObservable();
  getvalue = this.value_Popup.asObservable();
  getuserdata = this.setuserdata.asObservable();
  GetDestroy = this.checkDestroy.asObservable();

  constructor(
    private http: HttpClient,
    private route: Router,
    private empService: EmployerService,
    private candidateServcie: CandidateService) { }

  setuserData(data: any) {
    this.setuserdata.next(data);
  }

  setdestroy(val: any) {
    this.checkDestroy.next(val);
  }



  employer_signup(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'employer_register', data);
  }

  candidate_signup(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'candidate_register', data);
  }

  verify_email(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'email_verify', data);
  }

  login(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'login', data);
  }

  forgot_password(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'forgot_password', data);
  }

  reset_password(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'reset_password', data);
  }

  change_password(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + 'change_password', data);
  }

  //  To get country data
  country_data(id = 0): Observable<any[]> {
    if (id) {
      return this.http.get<any[]>(`${this.url}country/${id}`);
    } else {
      return this.http.get<any[]>(`${this.url}country`);
    }
  }

  profile(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'profile', data);
  }

  country_registration(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + 'country');
  }

  check_employer_email(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'check_employer_email', data);
  }
  check_candidate_email(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'check_candidate_email', data);
  }
  match_old_password(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'match_old_password', data);
  }

  check_document_number(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'check_document_number', data);
  }

  // get user detail
  getLoggedUserDetail() {
    let userDetails;
    const token = localStorage.getItem('token');

    // decode the token to get its payload
    userDetails = jwt_decode(token);
    return userDetails;


  }

  async profileData() {
    return new Promise((resolve, reject) => {
      this.details = this.getLoggedUserDetail();
      this.profile({ 'id': this.details.id }).subscribe(res => {
        this.profileDetail.next(res[`data`]);
        resolve(res['data']);
      }, (err) => {
        console.log('err => ', err);
        reject(err)
      });
    });
  }

  email_exists(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + 'email_exists', data);
  }

  async encrypt(message: any) {
    return AES.encrypt(message, this.secretKey).toString();
  }

  async decrypt(ciphertext: any) {
    return AES.decrypt(ciphertext.toString(), this.secretKey).toString(enc.Utf8);
  }

  async setProfileDetail(profileData: any) {
    localStorage.setItem('profile', await this.encrypt(JSON.stringify(profileData)));
    this.profileDetail.next(profileData);
  }
  public firstLogin(data: boolean) {
    this.firstLoginDetail.next(data);
  }
  public setUnSavedData(data: any) {
    this.unSavedData.next(data);
  }

  // public value_popup(data: boolean) {
  //   this.value_Popup.next(data);
  // }


  public changedProfileDetail(data: boolean) {
    // console.log('in observable');

    this.changed_profile_detail.next(data);
  }


  async getDecryptedProfileDetail() {
    const profile = await this.decrypt(localStorage.getItem('profile'));
    return JSON.parse(profile);
  }

  get_Type(data): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + 'business_type/' + data);
  }

  current_time_to_UTC(d: any) {
    if (d && d !== '') {
      const current_date = moment(d).format('YYYY/MM/DD');
      const current_time = moment(new Date()).format('HH:mm:ss');
      return moment(current_date + ' ' + current_time).toDate();
    }
    return '';
  }


  employer_landing(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + 'employer_landing_page');
  }

  candidate_landing(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + 'candidate_landing_page');
  }

  // myObservableArray: Observable<any[]> = new Observable<any[]>();
  // employer = new BehaviorSubject(null);
  // employerList = this.employer.asObservable();

  // checkHere() {
  //   return this.employer.next({});
  // }

  // delemployer(id): Observable<any[]> {
  //   return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  // }

}

const ngbModalOptions: NgbModalOptions = {
  // backdrop: 'static',
  // keyboard: false,
  // centered: true
};
