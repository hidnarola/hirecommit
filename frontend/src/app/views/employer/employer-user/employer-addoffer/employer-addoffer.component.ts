import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ControlContainer } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { countries } from '../../../../shared/countries';
import { Currency } from '../../../../shared/currency';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-addoffer',
  templateUrl: './employer-addoffer.component.html',
  styleUrls: ['./employer-addoffer.component.scss']
})
export class EmployerAddofferComponent implements OnInit {
  offer: any;
  addOfferForm: FormGroup;
  submitted = false;
  file: any;
  flag = true;
  location: any;
  location1: any;
  locationEdit: any = [];
  grp: any = [];
  Country: any = [];
  currency: any = [];
  groups: any;
  salary: any;
  unique: any = [];
  _country: any = [];
  detail: any;
  panelTitle: string;
  buttonTitle: string;
  id: any;
  constructor(private router: Router, private service: OfferService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getDetail(this.id);


    this.addOfferForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      salarytype: new FormControl(null, [Validators.required]),
      salaryduration: new FormControl({ value: '', disabled: this.flag }),
      country: new FormControl(null, [Validators.required]),
      location: new FormControl(null, [Validators.required]),
      currency_type: new FormControl(),
      salarybracket: new FormControl(null, [Validators.required]),
      expirydate: new FormControl(null, [Validators.required]),
      joiningdate: new FormControl(null, [Validators.required]),
      status: new FormControl(),
      offertype: new FormControl(null, [Validators.required]),
      group: new FormControl(null, [Validators.required]),
      commitstatus: new FormControl(null, [Validators.required]),
      customfeild1: new FormControl(null),
      customfeild2: new FormControl(null),
      customfeild3: new FormControl(null),
      notes: new FormControl(null),
      employer_id: new FormControl(null)
    });

    this.Country = countries;
    const obj = [];

    for (const [key, value] of Object.entries(countries)) {
      obj.push({ 'code': key, 'name': value });
    }
    this.Country = obj;
    console.log(this.Country);

    this.service.get_location().subscribe(res => {
      this.location = res['data']['data'];
      // console.log(this.location);
      this.location.forEach(element => {
        const fetch_country = element.country;
        this.unique = this.Country.filter(x => x.code === fetch_country);
        this._country.push(this.unique[0]);
      });
      this._country = this._country.filter(this.onlyUnique);
    });

    // get groups
    this.service.get_groups().subscribe(res => {
      this.groups = res['data']['data'];
      // console.log('hiiiiiiii', this.groups);
    });
  }


  getDetail(id: string) {
    if (id === '0') {
      this.detail = {
          _id: null,
          email: null,
          name: null,
          title: null,
          salarytype: null,
          salaryduration: null,
          country: null,
          location: null,
          currency_type: null,
          salarybracket: null,
          expirydate: null,
          joiningdate: null,
          offertype: null,
          group: null,
          commitstatus: null,
          customfeild1: null,
          customfeild2: null,
          customfeild3: null,
          notes: null,
        };
      this.panelTitle = 'Add Offer';
      this.buttonTitle = 'Add';
      //  this.addOfferForm.reset();
    } else {
      this.panelTitle = 'Edit Offer';
      this.buttonTitle = 'Edit';
      this.service.offer_detail(id).subscribe(res => {
        this.detail = res['data']['data'];

        this.addOfferForm.controls.email.setValue(this.detail.email);
        this.addOfferForm.controls.name.setValue(this.detail.name);
        this.addOfferForm.controls.title.setValue(this.detail.title);
        this.addOfferForm.controls.salarytype.setValue(this.detail.salarytype);
        this.addOfferForm.controls.salaryduration.setValue(this.detail.salaryduration);
        this.addOfferForm.controls.country.setValue(this.detail.country);

        this.addOfferForm.controls.currency_type.setValue(this.detail.currency_type);
        this.addOfferForm.controls.salarybracket.setValue(this.detail.salarybracket);
        this.addOfferForm.controls.expirydate.setValue(this.detail.expirydate);
        this.addOfferForm.controls.joiningdate.setValue(this.detail.joiningdate);
        this.addOfferForm.controls.status.setValue(this.detail.status);
        this.addOfferForm.controls.offertype.setValue(this.detail.offertype);
        this.addOfferForm.controls.group.setValue(this.detail.group);
        this.addOfferForm.controls.commitstatus.setValue(this.detail.commitstatus);
        this.addOfferForm.controls.customfeild1.setValue(this.detail.customfeild1);
        this.addOfferForm.controls.customfeild2.setValue(this.detail.customfeild2);
        this.addOfferForm.controls.customfeild3.setValue(this.detail.customfeild3);
        this.addOfferForm.controls.notes.setValue(this.detail.notes);




        this.onChange(this.detail.country);
        setTimeout(() => {
          this.GetLocation(this.detail.location);
        }, 300);

        console.log('subscribed!', this.detail);
      });
      // location

      // console.log('incoming salary', this.detail);
    }
  }

  GetLocation(val) {
    this.service.get_location().subscribe(res => {
      this.location1 = res['data']['data'];
      this.location1 = this.location1.filter(x => x._id === val);
      this.addOfferForm.controls.location.setValue(this.location1[0].city);
      console.log('subscribed loc!', this.location1);
    });
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  check(p) {
     console.log('panel title', p);
    if (this.panelTitle === 'Edit Offer') {
      this.addOfferForm.controls.status.enable;

    } else {
      this.addOfferForm.controls.status;
    }

  }

  onChange(e) {
    console.log(e);

    // location
    this.service.get_location().subscribe(res => {
      this.location1 = res['data']['data'];
      this.location1 = this.location1.filter(x => x.is_del === false);
      this.location1 = this.location1.filter(x => x.country === e);
    });
    // currencysalary
    this.currency = Currency;
    const obj = [];
    for (const [key, value] of Object.entries(this.currency)) {
      obj.push({ 'code': key, 'currency': value });
    }
    this.currency = obj;
    this.currency = this.currency.find(x => x.code === e);
    this.addOfferForm.controls.currency_type.setValue(this.currency.currency);


    // salary_brcaket

    this.service.get_salary_brcaket().subscribe(res => {
      this.salary = res['data']['data'];
      console.log('salary', this.salary);
      this.salary = this.salary.filter(x => x.is_del === false);
      this.salary = this.salary.filter(x => x.country === e);

    });
  }

  showdrop(val) {
    // this.addOfferForm.controls.salaryduration.enable();
    val == 'hourly' ? this.addOfferForm.controls.salaryduration.enable() : this.addOfferForm.controls.salaryduration.disable();
  }

  get f() { return this.addOfferForm.controls; }


  onSubmit(flag: boolean, id) {
    this.submitted = !flag;
    console.log('Offer edited1', this.addOfferForm.value);
    if (id != 0) {
      this.addOfferForm.controls.location.setValue(this.location1[0]._id);
      // console.log();

      this.service.edit_offer(this.id, this.addOfferForm.value).subscribe(res => {

        console.log('Offer edited', this.addOfferForm.value);
        this.router.navigate(['/employer/manage_offer/created_offerlist']);
      });
    } else {
      const uid = localStorage.getItem('userid');
      this.addOfferForm.controls.employer_id.setValue(uid);
      this.service.add_offer(this.addOfferForm.value).subscribe(res => {
        console.log(this.addOfferForm.value);

        this.offer = res;
        this.router.navigate(['/employer/manage_offer/created_offerlist']);

      });
      if (flag) {

        this.addOfferForm.reset();
        setTimeout(() => {

          this.router.navigate(['/employer/manage_offer/created_offerlist']);
        }, 300);
      }

    }

  }
  onClose() {
    this.router.navigate(['/employer/manage_offer/created_offerlist']);
  }
}
