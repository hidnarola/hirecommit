import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CandidateService {
    private url = 'http://localhost:3000/admin';
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
}