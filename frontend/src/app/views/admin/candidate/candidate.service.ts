import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    // private url = 'http://localhost:3000/admin';
    private url = env.environment.API_URL + 'employer';
    constructor(private http: HttpClient, private route: Router) { }

    myObservableArray: Observable<any[]> = new Observable<any[]>();
    employer = new BehaviorSubject(null);
    employerList = this.employer.asObservable();

    checkHere() {
        console.log('here', this.employer);
        return this.employer.next({});
    }

    get_candidate(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/manage_candidate/approved_candidate');
    }

    approved_candidate(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/approved_candidate/' + id, null);
    }
    deactivate_candidate(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/deactive_candidate/' + id, null);
    }

    candidate_detail(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/candidate/' + id);
    }
    new_request(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + 'employer/candidate/manage_candidate/new_request');
    }

    get_new_candidate(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/candidate/get_new', { ...params });
    }

    get_approved_candidate(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/candidate/get_approved', { ...params });
    }
}
