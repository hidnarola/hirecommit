import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewoffer-detail',
  templateUrl: './viewoffer-detail.component.html',
  styleUrls: ['./viewoffer-detail.component.scss']
})
export class ViewofferDetailComponent implements OnInit {
  accepted: boolean = false;
  submitted = false;
  registerForm: FormGroup;
  cancel_link = '/candidate/offers/offerlist';

  constructor(private router: Router) {
    console.log('candidate: viewoffer-detail component => ');
  }

  ngOnInit() {
    this.registerForm = new FormGroup({
      offerstatus: new FormControl('', [Validators.required])
    });
  }

  accepte() {
    Swal.fire({
      type: 'success',
      text: 'Offer Accepted Successfully..!'
    });
    this.accepted = true;
  }

  reject() {
    Swal.fire({
      type: 'error',
      text: 'Offer Rejected..!'
    });
    this.accepted = false;
  }

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    if (flag) {
      if (this.registerForm.value.offerstatus === 'accept') {
        Swal.fire({
          type: 'success',
          text: 'Offer Accepted Successfully..!'
        });
      } else {
        Swal.fire({
          type: 'error',
          text: 'Offer Rejected..!'
        });
      }
    }
    this.registerForm.reset();
  }

}
