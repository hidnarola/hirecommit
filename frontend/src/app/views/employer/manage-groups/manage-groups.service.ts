import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  // private url = 'http://localhost:3000/employer';
  private url = env.environment.API_URL + 'employer';
  constructor(private http: HttpClient, private route: Router) { }

  add_communication(data, id): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/add_group_details/' + id, { data });
  }

  view_groups(params): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/group/get', { ...params });
  }
  lists(params): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/lists', { ...params });
  }

  get_detail(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/group_detail/' + id);
  }

  get_communication_detail(id): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}` + '/group_communication_detail/' + id);
  }

  deleteGroup(id): Observable<any[]> {
    return this.http.put<any[]>(`${this.url}` + '/deactivate_group/' + id, {});
  }

  addGroup(data): Observable<any[]> {
    return this.http.post<any[]>(`${this.url}` + '/group', data);
  }

}
