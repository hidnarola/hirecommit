import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { LocationService } from '../location.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-location-add-view',
  templateUrl: './location-add-view.component.html',
  styleUrls: ['./location-add-view.component.scss']
})
export class LocationAddViewComponent implements OnInit {
  decyptCountry: any;
  cnt: any;
  Country: any = [];
  addLocation: FormGroup;
  submitted = false;
  location: any;
  locations: any;
  id: any;
  location_popup: any;
  detail: any = [];
  panelTitle = 'Add Location';
  buttonTitle: string;
  cnt1: any;
  cancel_link = '/employer/locations/list';
  is_Edit: boolean = false;
  is_View: boolean = false;
  show_spinner = false;
  userDetail: any;
  // currentUrl = '';
  constructor(private router: Router,
    private toastr: ToastrService,
    private commonService: CommonService,
    private service: LocationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
  ) {
    // this.currentUrl = this.router.url;
    this.userDetail = this.commonService.getLoggedUserDetail();
  }

  ngOnInit() {
    this.spinner.show();
    // this.commonService.getuserdata.subscribe(res => {
    //   this.detail.city = res.city;
    // });
    this.addLocation = new FormGroup({
      // country: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required, this.noWhitespaceValidator])
    });
    if (this.route.snapshot.data.title !== 'Add') {
      this.route.params.subscribe((params: Params) => {
        this.id = params['id'];
      });
      this.getDetail(this.id);
      if (this.route.snapshot.data.title === 'Edit') {
        this.is_Edit = true;
      } else {
        this.is_View = true;
      }
    } else {
      this.spinner.hide();
    }

    // country
    // this.commonService.getprofileDetail.subscribe(async res => {
    //   if (res) {
    //     this.decyptCountry = res;
    //   } else {
    //     const _country = await this.commonService.decrypt(localStorage.getItem('profile'));
    //     if (_country) {
    //       this.decyptCountry = JSON.parse(_country);
    //       this.cnt1 = this.decyptCountry.country;
    //       console.log('decyptCountry==>', this.decyptCountry.country);
    //     } else {
    //       console.log(' country data not found');
    //     }
    //   }
    // });
    // this.commonService.country_data().subscribe(res => {
    //   res['data'].forEach(element => {
    //     this.Country.push({ 'label': element.country, 'value': element._id });
    //   });
    // });
  }

  // Remove white spaces
  noWhitespaceValidator(control: FormControl) {
    if (typeof (control.value || '') === 'string' || (control.value || '') instanceof String) {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }


  // issue
  getDetail(id: string) {
    if (this.id) {
      this.panelTitle = 'Edit Location';

      this.service.get_location(id).subscribe(res => {
        this.detail = res['data']['data'];
        this.spinner.hide();
        // this.cnt = res['data']['data'].country;
      }, (err) => {
        this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
      });
    } else {
      this.detail = {
        _id: null,
        city: null,
        // country: null,
      };
      this.panelTitle = 'Add Location';

      this.addLocation.reset();
    }
  }

  get f() { return this.addLocation.controls; }

  onSubmit(flag: boolean, id) {
    this.submitted = true;
    this.show_spinner = true;
    if (this.id && flag) {

      const res_data = {
        'id': this.id,
        // 'country': this.detail.country,
        'city': this.detail.city
      };
      this.confirmationService.confirm({
        message: 'Are you sure that you want to Update this record?',
        accept: () => {

          this.service.edit_location(res_data).subscribe(res => {
            if (res['data']['status'] === 1) {
              this.submitted = false;
              this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
              this.addLocation.reset();
              if (this.userDetail.role === 'employer') {
                this.router.navigate([this.cancel_link]);
              } else if (this.userDetail.role === 'sub-employer') {
                this.router.navigate(['/sub_employer/locations/list']);
              }
            }
            this.submitted = false;
          }, (err) => {
            this.show_spinner = false;
            this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
          });
        }, reject: () => {
          this.show_spinner = false;
        }
      });
    } else {
      if (flag) {
        this.show_spinner = true;
        this.service.add(this.addLocation.value).subscribe(res => {
          this.location = res;
          if (res['data']['status'] === 1) {
            this.submitted = false;
            this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });
            this.addLocation.reset();
            if (this.userDetail.role === 'employer') {
              this.router.navigate([this.cancel_link]);
            } else if (this.userDetail.role === 'sub-employer') {
              this.router.navigate(['/sub_employer/locations/list']);
            }
          }
          this.submitted = false;
        }, (err) => {
          this.show_spinner = false;
          this.toastr.error(err['error']['message'], 'Error!', { timeOut: 3000 });
        });
      } else {
        this.show_spinner = false;
      }
    }
  }
  ngOnDestroy(): void {
    // if (this.userDetail.role === 'employer' || this.userDetail.role === 'sub-employer') {
    //   if (!(this.is_View)) {
    //     this.location_popup = this.addLocation.value;
    //     Object.keys(this.addLocation.controls).forEach((v, key) => {
    //       if (this.addLocation.controls[v].value) {
    //         this.commonService.setuserData(this.detail);
    //         this.router.navigate([this.currentUrl]);
    //         this.commonService.setUnSavedData({ value: true, url: this.currentUrl, newurl: this.router.url });

    //       }
    //     });
    //   }

    // }
  }
}
