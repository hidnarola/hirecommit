import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class OfferService {
    // private url = 'http://localhost:3000/employer';
    // private url = 'http://13.235.235.178:3000/employer';
    private url = env.environment.API_URL + 'employer';
    constructor(private http: HttpClient, private route: Router) { }

    // offer

    add_offer(data) {
        return this.http.post(`${this.url}` + '/offer/add_offer', data);
    }

    view_offer(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/offer/get', { ...params });
    }

    offer_detail(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/offer/offer_detail/' + id);
    }

    deactivate_offer(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/offer/deactive_offer/' + id, null);
    }

    edit_offer(id, data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/offer/edit_offer/' + id, data);
    }

    // get_location(country: string): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.url}` + `/get_location/${country}`);
    // }

    get_groups(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/group/groups_list');
    }

    get_salary_bracket(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/salary_bracket/get_salary_bracket');
    }

    get_salary_country(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/salary_bracket/get_salary_country');
    }

    change_status(id, data): Observable<any[]> {
        const body = { status: data };
        return this.http.put<any[]>(`${this.url}` + '/offer/status_change/' + id, body);
    }

     get_candidate_list(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/candidate');
    }

    get_location(country): Observable <any[]> {
        return this.http.get<any[]>(`${this.url}` + `/location/get_location/` + country);
    }

    get_customfield(): Observable <any[]> {
        return this.http.get<any[]>(`${this.url}` + `/customfield`);
    }

}
