import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from './../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmployerService {
    private url = env.environment.API_URL + 'employer';

    constructor(private http: HttpClient, private route: Router) { }

    update_Profile(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}`, data);
    }

}