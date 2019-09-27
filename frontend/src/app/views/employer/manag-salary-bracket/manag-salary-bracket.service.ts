import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class SalaryBracketService {
    private url = 'http://localhost:3000/employer';
    constructor(private http: HttpClient, private route: Router) {  }

    view_salary_brcaket(): Observable<any[]>{
        return this.http.get<any[]>(`${this.url}` + '/view_salary_bracket');
    }

    deactivate_salary_brcaket(id): Observable<any[]>{
        return this.http.put<any[]>(`${this.url}` + '/deactive_salary_bracket/' + id , null)
    }

  
}
