import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class EmployerService {
    private url = 'http://localhost:3000/employer';
    constructor(private http: HttpClient, private route: Router) { }

   // offer
    view_offer(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/offer/view_offer');
    }

    // candidate

    view_approved_candidate(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/manage_candidate/approved_candidate');
    }

    // Sub-Accounts

    // view_sub_account(): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.url}` + '/view_sub_accounts');
    // }


}
