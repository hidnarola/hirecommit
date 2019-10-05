import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class OfferListService {
    private url = 'http://localhost:3000/candidate';

    constructor(private http: HttpClient, private route: Router) { }

    view_offerList(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/view_offer');
    }

    deactivate_offer(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/deactive_offer/' + id, null);
    }
    get_employer(id):Observable<any[]>{
        return this.http.get<any[]>(`${this.url}` + '/get_employer/' + id);
    }
}
