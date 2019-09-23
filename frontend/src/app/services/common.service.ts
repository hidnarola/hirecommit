import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private url = 'http://localhost:3000';
  constructor(private http: HttpClient, private route: Router) { }

  employer_signup(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/emp_register', data);
  }

  candidate_signup(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/candidate_register', data);
  }

  login(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/login', data);
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
