import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../manage-location.service';
import { countries } from '../../../../shared/countries';
import { timeout } from 'q';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
export class ViewLocationComponent implements OnInit {
  country: any = [];
  locations: any;
  loc: any;
  salary: any = [];
  _country: any =[];
  unique: any;
  Country: any;

  location: any;
 
  c_name: any = [];
  sal: any = [];
  salnew: any = [];

  constructor(private router: Router, private service: LocationService) { }
  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });
    setTimeout(() => {

      this.bind();
    }, 100);
    this.country = countries;

  }



  buttonInRowClick(event: any): void {
    event.stopPropagation();
    console.log('Button in the row clicked.');
  }

  wholeRowClick(): void {
    console.log('Whole row clicked.');
  }

  nextButtonClickEvent(): void {
    // do next particular records like  101 - 200 rows.
    // we are calling to api

    console.log('next clicked');
  }
  previousButtonClickEvent(): void {
    // do previous particular the records like  0 - 100 rows.
    // we are calling to API
  }
  detail() {
    // this.router.navigate(['/groups/summarydetail']);
  }

  edit(id) {
    this.router.navigate(['/employer/manage_location/add_location/' + id]);
  }

  delete(id) {
    this.service.deactivate_location(id).subscribe(res => {
      console.log("deactivate location", res);
      this.bind();
    })
  }

  onAdd() {
    //  this.router.navigate(['/groups/addgroup']);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }


  public bind() {

    // this.service.view_location().subscribe(res => {
    //   this.locations = res['data']['data'];
    //   console.log("location", this.locations);
    //   this.locations = this.locations.filter(x => x.is_del === false);

    // })
    //
    this.service.view_location().subscribe(res => {
      this.locations = res['data']['data'];
      console.log("location", this.locations);
      this.locations = this.locations.filter(x => x.is_del === false);

      this.Country = countries;
      var obj = [];

      for (let [key, value] of Object.entries(countries)) {
        obj.push({ 'code': key, 'name': value });
      }
      this.Country = obj;

      console.log('cnt', this.Country);

      this.locations.forEach(element => {
        let fetch_country = element.country;
        console.log('fetch', fetch_country);

        this.unique = this.Country.filter(x => x.code === fetch_country);
        console.log('unique', this.unique[0]);

        this._country.push(this.unique[0]);
        console.log('_cnt', this._country);
      });
      this._country = this._country.filter(this.onlyUnique);
      console.log('_cnt---------', this._country);
    })
  }
  public GetCountry(country) {
    this.c_name = this._country.filter(x => x.code === country);
    this.c_name = this.c_name[0].name;
    return this.c_name
  }
}
