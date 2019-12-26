import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubAccountService {
  private url = env.environment.API_URL + 'employer';
  // private url = 'http://localhost:3000/employer';
  // myObservableArray: Observable<any[]> = new Observable<any[]>();
  // data = new BehaviorSubject(null);
  // dataList = this.data.asObservable();
  constructor(private http: HttpClient, private route: Router) { }

  // Sub-Accounts
  // checkHere() {
  //   return this.data.next({});
  // }

  view_sub_account(params): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/sub_account/get', { ...params });
  }

  add_sub_account(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/sub_account', data);
  }

  view_sub_acc_detail(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/sub_account/' + id);
  }

  edit_sub_account(id, data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/sub_account/details', { id, data });
  }

  decativate_sub_account(id): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/sub_account/deactive_sub_account', { 'id': id });
  }

  admin_rigth(data): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/sub_account', data);
  }
  

}
