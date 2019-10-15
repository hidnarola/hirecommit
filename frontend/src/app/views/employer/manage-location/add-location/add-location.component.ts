import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { countries } from '../../../../shared/countries';
import { LocationService } from '../manage-location.service';
import { ConfirmationService } from 'primeng/api';
import { CommonService } from '../../../../services/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  Country: any = [];
  addLocation: FormGroup;
  submitted = false;
  location: any;
  locations: any;
  id: any;
  detail: any = [];
  panelTitle: string;
  buttonTitle: string;
  constructor(private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private service: LocationService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.addLocation = new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required])

    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log(this.id);
    });
    this.getDetail(this.id);

    // this.Country = countries;
    // const obj = [];
    // for (const [key, value] of Object.entries(countries)) {
    //   obj.push({ 'code': key, 'name': value });
    // }
    // this.Country = obj;
    this.commonService.country_data().subscribe(res => {
      this.Country = res['data'];
      console.log('country_data ==>', this.Country);
    });
  }

  getDetail(id: string) {
    if (this.id) {
      this.panelTitle = 'Edit Location';
      this.buttonTitle = 'Update';
      this.service.get_location(id).subscribe(res => {
        this.detail = res['data']['data'];
      });

    } else {
      this.detail = {
        _id: null,
        city: null,
        country: null,
      };
      this.panelTitle = 'Add Location';
      this.buttonTitle = 'Add';
      this.addLocation.reset();
    }
  }

  get f() { return this.addLocation.controls; }

  onSubmit(flag: boolean, id) {
    this.submitted = true;
    if (this.id && flag) {
      const res_data = {
        'id': this.id,
        'country': this.detail.country,
        'city': this.detail.city
      };
      this.service.edit_location(res_data).subscribe(res => {
        console.log('edited !!', res);
        if (res['data']['status'] === 1) {
          this.submitted = false;
          this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
          this.addLocation.reset();
          // this.router.navigate(['/employer/customfeild/list'])
        }
        this.submitted = false;
        // this.router.navigate(['/employer/manage_location/view_location']);
      }, (err) => {
        this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
      });
    } else {
      if (flag) {
        this.service.add_location(this.addLocation.value).subscribe(res => {
          this.location = res;
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addLocation.reset();
            // this.router.navigate(['/employer/customfeild/list'])
          }
          this.submitted = false;
        }, (err) => {
          console.log('error msg ==>', err['error']['message']);

          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
        this.addLocation.reset();
        // this.router.navigate(['/employer/manage_location/view_location']);
      }
    }
  }

  onClose() {
    this.router.navigate(['/employer/manage_location/view_location']);
  }

  // public bind() {
  //   this.service.view_location().subscribe(res => {
  //     this.locations = res['data']['data'];
  //     this.location = this.location.filter(x => x.is_del === false);
  //   });
  // }
}
