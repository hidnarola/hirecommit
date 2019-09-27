import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SubAccountService {
    private url = 'http://localhost:3000/employer';
    constructor(private http: HttpClient, private route: Router) { }

    // Sub-Accounts

    view_sub_account(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/view_sub_accounts');
    }

    add_sub_account(data): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/add_sub_account', data);
    }
}
