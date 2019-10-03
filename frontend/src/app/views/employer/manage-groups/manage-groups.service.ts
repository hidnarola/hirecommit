import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class GroupService {
    private url = 'http://localhost:3000/employer';
    constructor(private http: HttpClient, private route: Router) { }

    add_communication(data, id): Observable<any[]> {
      return this.http.post<any[]>(`${this.url}` + '/add_group_details/' + id, {data});
    }

    view_groups(): Observable<any[]> {
      return this.http.get<any[]>(`${this.url}` + '/view_groups');
    }
    

}
