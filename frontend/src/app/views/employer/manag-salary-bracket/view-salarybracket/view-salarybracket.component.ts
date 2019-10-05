import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryBracketService } from '../manag-salary-bracket.service';
import { countries } from '../../../../shared/countries';
@Component({
  selector: 'app-view-salarybracket',
  templateUrl: './view-salarybracket.component.html',
  styleUrls: ['./view-salarybracket.component.scss']
})
export class ViewSalarybracketComponent implements OnInit {
  Country: any;
  salary: any;
  location: any;
  unique: any = [];
  _country: any = [];
  c_name: any =[];
  sal:any=[] ;
  salnew: any=[];

  unq:any;
  constructor(private router: Router, private service: SalaryBracketService) { }
  ngOnInit() {
     $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });
    this.bind();
    
    //   this.location = this.location.filter(this.onlyUnique);
    //   console.log('countryy', this.location);
    //   //  let country_name = element.country;
    //   //  this.salary.forEach(element => {

    //   //   //  this.c_name = this._country.filter(x => x.code === element.country)

    //   //   const cname= this._country.filter(x => x.code === element.country)
    //   //   if(cname != null){

    //   //     this.c_name.push(cname);
    //   //     console.log('c_name', this.c_name);
    //   //   }
    //   //  });



    // })
  
    

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
    this.router.navigate(['/employer/manage_salarybracket/add_salarybracket/' + id]);
  }

  delete(id) {
    this.service.deactivate_salary_brcaket(id).subscribe(res => {
      console.log("deactivate salary", res);
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
    this.service.view_salary_brcaket().subscribe(res => {
      this.salary = res['data']['data'];
      console.log("salaary", this.salary);
      this.salary = this.salary.filter(x => x.is_del === false);

      this.Country = countries;
      var obj = [];

      for (let [key, value] of Object.entries(countries)) {
        obj.push({ 'code': key, 'name': value });
      }
      this.Country = obj;

      console.log('cnt', this.Country);
    
      this.salary.forEach(element => {
        let fetch_country = element.country;
        console.log('fetch', fetch_country);

        this.unique = this.Country.filter(x => x.code === fetch_country);
        console.log('unique', this.unique);

        this._country.push(this.unique[0]);
        console.log('_cnt', this._country);
      });
      this._country = this._country.filter(this.onlyUnique);
    })
  }

  public GetCountry(country) {
    this.c_name = this._country.filter(x => x.code === country);
    this.c_name = this.c_name[0].name;
    return this.c_name
  }
}
