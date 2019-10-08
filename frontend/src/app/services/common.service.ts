import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // private url = 'http://localhost:3000';
  private url = env.environment.API_URL;

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



  // myObservableArray: Observable<any[]> = new Observable<any[]>();
  // employer = new BehaviorSubject(null);
  // employerList = this.employer.asObservable();

  // checkHere() {
  //   console.log('here', this.employer);
  //   return this.employer.next({});
  // }

  // delemployer(id): Observable<any[]> {
  //   return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  // }
}
