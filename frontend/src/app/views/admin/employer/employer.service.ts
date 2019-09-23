import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  private url = 'http://localhost:3000';
  constructor(private http: HttpClient, private route: Router) { }

  myObservableArray: Observable<any[]> = new Observable<any[]>();
  employer = new BehaviorSubject(null);
  employerList = this.employer.asObservable();

  checkHere() {
    console.log('here', this.employer);
    return this.employer.next({});
  }

  getemployer(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/view_employer');
  }

  getemployerDetail(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/' + id);
  }

  addemployer(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/employer', data);
  }

  delemployer(id): Observable<any[]> {
    return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  }

  // delemployer(id): Observable<any[]> {
  //   return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  // }
}
