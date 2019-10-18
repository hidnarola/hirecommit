import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-add-view',
  templateUrl: './location-add-view.component.html',
  styleUrls: ['./location-add-view.component.scss']
})
export class LocationAddViewComponent implements OnInit {

  Country: any = [];
  addLocation: FormGroup;
  submitted = false;
  location: any;
  locations: any;
  id: any;
  detail: any = [];
  panelTitle: string;
  buttonTitle: string;
  cancel_link = '/employer/locations/list';

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private service: LocationService,
    private route: ActivatedRoute
  ) {
    console.log('employer - locations : add-location component => ');
  }

  ngOnInit() {
    this.addLocation = new FormGroup({
      country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required])
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
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
        this.service.add(this.addLocation.value).subscribe(res => {
          this.location = res;
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addLocation.reset();
            // this.router.navigate(['/employer/customfeild/list'])
          }
          this.submitted = false;
        }, (err) => {
          this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        });
        this.addLocation.reset();
        this.router.navigate([this.cancel_link]);
      }
    }
  }

}
