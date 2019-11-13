import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
private candidate_url = environment.API_URL + 'candidate';
  constructor(private socket: Socket, private http: HttpClient) { }


  joinGrp(id) {
    this.socket.emit('join', id);
  }
  leaveGrp(id) {
    this.socket.emit('leave', id);
  }

  changeOffer(id) {
        this.socket.emit('changeOffer', id);
    }
  getOffer() {
    console.log('getOffer :  ==> ', );
    return new Observable((observer) => {
      this.socket.on('Offer', (msg) => {
        console.log('Client : Offer ==> ');
        observer.next(msg);
      });
    });
    }
}
