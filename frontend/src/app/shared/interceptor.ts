import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable()
export class Interceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser = localStorage.getItem('token');
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    // Authorization: `Bearer ${currentUser}`
                    'x-access-token': `${currentUser}`
                }
            });
        }
        return next.handle(request);
    }
}
