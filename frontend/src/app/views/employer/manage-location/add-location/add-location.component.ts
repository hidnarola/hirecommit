import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { countries } from '../../../../shared/countries';
import { LocationService } from '../manage-location.service';
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
  constructor(private router: Router, private service: LocationService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.addLocation = new FormGroup({
      country: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required])

    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      // console.log(this.id);
    })
    this.getDetail(this.id);

    this.Country = countries;
    var obj = [];
    for (let [key, value] of Object.entries(countries)) {
      obj.push({ 'code': key, 'name': value });
    }
    this.Country = obj;
  }

  getDetail(id: string) {
    if (id === '0') {
      this.detail =
        {
          _id: null,
          city: null,
          country: null,
        };
      this.panelTitle = 'Add Location';
      this.buttonTitle = "Add";
      this.addLocation.reset();
    }
    else {
      this.panelTitle = 'Edit Location';
      this.buttonTitle = "Edit";
      this.service.get_location(id).subscribe(res => {
        // console.log('res', res);

        this.detail = res['data']['data']
        // console.log("subscribed!", this.detail);
      });

    }
  }

  get f() { return this.addLocation.controls; }

  onSubmit(flag: boolean, id) {
    this.submitted = !flag;
    if (id != 0) {
      this.service.edit_location(this.id, this.addLocation.value).subscribe(res => {
        // console.log('edited !!');
      })
    }
    else {
      if (flag) {
        // console.log("incoming", this.addLocation);
        this.service.add_location(this.addLocation.value).subscribe(res => {
          this.location = res;
          this.bind();
        })
        this.addLocation.reset();
      }
    }
    this.router.navigate(['/employer/manage_location/view_location']);
  }

  onClose() {
    this.router.navigate(['/employer/manage_location/view_location']);
  }

  public bind() {
    this.service.view_location().subscribe(res => {
      this.locations = res['data']['data'];
      this.location = this.location.filter(x => x.is_del === false)
    })
  }
}
