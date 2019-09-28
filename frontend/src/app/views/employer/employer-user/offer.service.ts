import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class OfferService {
    private url = 'http://localhost:3000/employer';
    constructor(private http: HttpClient, private route: Router) { }

    // offer

    add_offer(data){
        return this.http.post(`${this.url}` + '/offer/add_offer',data)
    }
    
    view_offer(): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/offer/view_offer');
    }

    offer_detail(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/offer/offer_detail/' + id);
    }

    deactivate_offer(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/offer/deactive_offer/'+ id, null)
    }

    edit_offer(data): Observable <any[]> {
        return this.http.put<any[]>(`${this.url}` + '/offer/edit_offer/'+ data._id,data)
    }
}