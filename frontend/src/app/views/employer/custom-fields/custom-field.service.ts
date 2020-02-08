import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CustomFieldService {

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

    view_custom_feild(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/customfield/get', { ...params });
        // http://localhost:3000/employer/customfield/get
    }

    add_custom_field(data): Observable<any[]> {

        return this.http.post<any[]>(`${this.url}` + '/customfield', data);
    }

    edit_custom_field(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/customfield', data);
    }

    get_custom_field(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/customfield/' + id);
    }

    delete_custom_field(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/customfield/delete/' + id, {});
    }

}
