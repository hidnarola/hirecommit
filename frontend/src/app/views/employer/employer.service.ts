import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as env from './../../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class EmployerService {
    private url = env.environment.API_URL + 'employer';
    
    constructor(private http: HttpClient, private route: Router) {
     }

}
