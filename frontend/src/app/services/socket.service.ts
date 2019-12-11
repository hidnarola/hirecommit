import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }


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
    // console.log('getOffer :  ==> ', );
    return new Observable((observer) => {
      this.socket.on('Offer', (msg) => {
        // console.log('Client : Offer ==> ');
        observer.next(msg);
      });
    });
  }

  isAllow(id) {
    this.socket.emit('isAllow', id);
  }
  reflectuser() {
    // console.log('getOffer :  ==> ', );
    return new Observable((observer) => {
      this.socket.on('Reflect', (msg) => {
        // console.log('Client : Offer ==> ');
        observer.next(msg);
      });
    });
  }
}
