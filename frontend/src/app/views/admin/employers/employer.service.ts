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

  // sub - employer
  get_sub_employers(params): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/employer/sub_account/get', { ...params });
  }

  get_details_sub_employer(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/sub_account/' + id);
  }
  edit_sub_employer(id, data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/employer/sub_account/details', { id, data });
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
    return this.http.put<any[]>(`${this.url}` + '/employer/deactive_employer/' + id, null);
  }

  aprroved_employer(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/employer', data);
  }

  update_employer(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/employer/update/', data);
  }

  // delemployer(id): Observable<any[]> {
  //   return this.http.delete<any[]>(`${this.url}` + '/employer/' + id);
  // }

  approved(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/candidate', data);
  }

  offer_report(id, params): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/employer/get_report/' + id, { ...params });
  }

  history(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/history/' + id);
  }


  offer_detail_admin(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/details/' + id);
  }
  get_customfield(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/employer/customfield/first/' + id);
  }
  admin_rights_SuperAdmin(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/employer/sub_account', data);
  }
  // http://localhost:3000/admin/employer/details/5dc53b1c42b0a03b045f050a
}
