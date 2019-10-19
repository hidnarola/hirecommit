import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private employer_url = env.environment.API_URL + 'employer';
    private candidate_url = env.environment.API_URL + 'candidate';

    constructor(private http: HttpClient, private route: Router) { }

    // Employer Services
    add_offer(data) {
        return this.http.post(`${this.employer_url}` + '/offer', data);
    }

    view_offer(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.employer_url}` + '/offer/get', { ...params });
    }

    offer_detail(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + '/offer/offer_detail/' + id);
    }

    deactivate_employer_offer(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.employer_url}` + '/offer/deactive_offer/' + id, null);
    }

    edit_offer(id, data): Observable<any[]> {
        return this.http.put<any[]>(`${this.employer_url}` + '/offer/edit_offer/' + id, data);
    }

    // get_location(country: string): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.employer_url}` + `/get_location/${country}`);
    // }

    get_groups(): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + '/group/groups_list');
    }

    get_salary_bracket(): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + '/salary_bracket/get_salary_bracket');
    }

    get_salary_country(): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + '/salary_bracket/get_salary_country');
    }

    change_status(id, data): Observable<any[]> {
        const body = { status: data };
        return this.http.put<any[]>(`${this.employer_url}` + '/offer/status_change/' + id, body);
    }

    get_candidate_list(): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + '/candidate');
    }

    get_location(country): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + `/location/get_location/` + country);
    }

    get_customfield(): Observable<any[]> {
        return this.http.get<any[]>(`${this.employer_url}` + `/customfield`);
    }
    // Employer Services

    // Candidate Service
    view_offerList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.candidate_url}` + '/view_offer');
    }

    deactivate_candidate_offer(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.candidate_url}` + '/deactive_offer/' + id, null);
    }
    get_employer(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.candidate_url}` + '/get_employer/' + id);
    }
    // Candidate Service
}
