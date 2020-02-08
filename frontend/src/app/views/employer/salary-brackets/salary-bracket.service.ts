import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SalaryBracketService {
    // private url = 'http://localhost:3000/employer';
    private url = env.environment.API_URL + 'employer';

    constructor(private http: HttpClient, private route: Router) {}

    view_salary_brcaket(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/salary_bracket/get', { ...params });
    }

    deactivate_salary_brcaket(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/salary_bracket/deactive_salary_bracket/' + id, null);
    }

    add_salary_brcaket(data): Observable<any[]> {

        return this.http.post<any[]>(`${this.url}` + '/salary_bracket', data);
    }

    get_location(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + `/location/get_location`);
    }

    edit_salary_bracket(data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/salary_bracket', data);
    }

    get_salary_bracket_detail(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/salary_bracket/' + id);
    }

}
