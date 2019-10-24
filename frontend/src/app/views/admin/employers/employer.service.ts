import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployerService {
  // private url = 'http://localhost:3000/admin';
  private url = env.environment.API_URL + 'admin';

  constructor(private http: HttpClient, private route: Router) { }

  myObservableArray: Observable<any[]> = new Observable<any[]>();
  employer = new BehaviorSubject(null);
  employerList = this.employer.asObservable();

  checkHere() {
    return this.employer.next({});
  }

  getemployer(): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/view_employer');
  }

  getemployerDetail(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/' + id);
  }

  // get new employer
  get_new_employer(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/employer/get_new', data);
  }

  // get approved employer
  get_approved_employer(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/employer/get_approved', data);
  }

  deactivate_employer(id): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/deactive_employer/' + id, null);
  }

  aprroved_employer(id): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/approved_employer/' + id, null);
  }

  // delemployer(id): Observable<any[]> {
  //   return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  // }

  approved(data): Observable<any[]> {
      return this.http.put<any[]>(`${this.url}` + '/candidate', data);
  }
}
