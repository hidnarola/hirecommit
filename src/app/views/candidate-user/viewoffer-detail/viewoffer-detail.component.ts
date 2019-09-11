import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ThemeService } from 'ng2-charts';
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
  constructor(private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      offerstatus: new FormControl('', [Validators.required])
    });
  }

  accepte() {
    // console.log('dsd' );
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
      // console.log(this.registerForm.value.offerstatus);

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

  onclick(){
    this.router.navigate(['/candidateUser/offerlist'])
  }
}
