import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-addoffer',
  templateUrl: './employer-addoffer.component.html',
  styleUrls: ['./employer-addoffer.component.scss']
})
export class EmployerAddofferComponent implements OnInit {
 form: FormGroup;
  addOrderForm: FormGroup;
  submitted = false;
  id: number;
  file: any;
  edit_offers : any;
  offer: any;
  constructor(private router: Router, private route: ActivatedRoute, private service: OfferService) { }

  ngOnInit() {
   
    let sub = this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log('from add-edit',this.id);
    })

    this.service.offer_detail(this.id).subscribe(res => {
      this.edit_offers = res['data']['data'];
      console.log(this.edit_offers);
    })

    this.addOrderForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      salarytype: new FormControl(null,[Validators.required]),
      salaryduration: new FormControl(null),
      salaryBracket: new FormControl(null, [Validators.required]),
      expiryDate: new FormControl(null, [Validators.required]),
      joiningDate: new FormControl(null, [Validators.required]),
      offertype: new FormControl(null, [Validators.required]),
      group: new FormControl(null, [Validators.required]),
      commitstatus: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      customField1: new FormControl(null, [Validators.required]),
      customField2: new FormControl(null, [Validators.required]),
      customField3: new FormControl(null, [Validators.required]),
      notes: new FormControl(null, [Validators.required]),
    });
  }

  get f() { return this.addOrderForm.controls; }

  onSubmit(flag: boolean) {
    this.submitted = !flag;

      console.log(this.addOrderForm.value);

    if (flag) {
      // this.service.add_offer(this.addOrderForm.value).subscribe(res => {
      //   this.offer = res;
      //   console.log("add",this.offer);
        
      // })
      this.addOrderForm.reset();
      this.router.navigate(['/employer/manage_offer/created_offerlist']);
    }
  }

  onClose() {
    this.router.navigate(['/employer/manage_offer/created_offerlist']);
  }

  

onclick(form:NgForm){
  this.service.edit_offer(form.value).subscribe(res => {
      console.log("updated",res);})

  }

}
