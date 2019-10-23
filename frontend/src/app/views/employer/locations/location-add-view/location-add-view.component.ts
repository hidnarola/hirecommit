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
  decyptCountry: any;
  LocationAdd: any;
  cnt: any;
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
  constructor(private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private service: LocationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.addLocation = new FormGroup({
      // country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required])
    });
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
    this.getDetail(this.id);

    this.commonService.getprofileDetail.subscribe(async res => {
      if (res) {
        this.decyptCountry = res;
      } else {
        const _country = await this.commonService.decrypt(localStorage.getItem('profile'));
        if (_country) {
          this.decyptCountry = JSON.parse(_country);
          console.log('decyptCountry==>', this.decyptCountry.country);
        } else {
          console.log(' country data not found');
        }
      }
    });
    // this.commonService.country_data().subscribe(res => {
    //   res['data'].forEach(element => {
    //     this.Country.push({ 'label': element.country, 'value': element._id });
    //   });
    // });
  }

  //issue
  getDetail(id: string) {
    if (this.id) {
      this.panelTitle = 'Edit Location';

      this.service.get_location(id).subscribe(res => {
        this.detail = res['data']['data'];
        this.cnt = res['data']['data'].country;
        console.log(' edited data ', this.detail);

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
          this.router.navigate([this.cancel_link]);
        }
        this.submitted = false;
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      if (flag) {

        this.LocationAdd = {
          'country': localStorage.getItem('country'),
          'city': this.addLocation.value['city']
        }
        console.log('>>', this.LocationAdd);
        this.service.add(this.LocationAdd).subscribe(res => {
          this.location = res;
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addLocation.reset();
            this.router.navigate([this.cancel_link]);
          }
          this.submitted = false;
        }, (err) => {
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
        this.addLocation.reset();
        this.router.navigate([this.cancel_link]);
      }
    }
  }
}
