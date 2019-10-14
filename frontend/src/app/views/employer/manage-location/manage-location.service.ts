import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    // private url = 'http://localhost:3000/employer';
    private url = env.environment.API_URL + 'employer';


    constructor(private http: HttpClient, private route: Router) { }

    view_location(params): Observable<any[]> {
        return this.http.post<any[]>(`${this.url}` + '/view_location', {...params});
    }

    deactivate_location(id): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/deactivate_location/' + id, null);
    }

    add_location(data): Observable<any[]> {
        console.log('service add location', data);

        return this.http.post<any[]>(`${this.url}` + '/add_location' , data);
    }

    get_location(id): Observable<any[]> {
        return this.http.get<any[]>(`${this.url}` + '/location_detail/' + id);
    }

    edit_location(id, data): Observable<any[]> {
        return this.http.put<any[]>(`${this.url}` + '/edit_location/' + id, data);
    }
}
