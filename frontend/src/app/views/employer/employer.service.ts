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

    get_profile(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}`, data);
    }

    setup(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/login_first_status', data);
    }    // employer/login_first_status

    check_approved(data): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/checkStatus/' + data);
    }

    information(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/display_message', data);
    }
}
