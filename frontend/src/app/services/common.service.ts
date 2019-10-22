import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import { AES, enc } from 'crypto-ts';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private url = 'http://localhost:3000';
  private url = env.environment.API_URL;
  private secretKey = 'myhardpassword';
  private profileDetail = new BehaviorSubject(null);
  getprofileDetail = this.profileDetail.asObservable();


  constructor(private http: HttpClient, private route: Router) { }

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

  // get user detail
  getLoggedUserDetail() {
    let userDetails;
    const token = localStorage.getItem('token');
    // decode the token to get its payload
    userDetails = jwt_decode(token);
    return userDetails;
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
