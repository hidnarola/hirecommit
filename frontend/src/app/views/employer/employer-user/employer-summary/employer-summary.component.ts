import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EmployerService } from '../../employer.service';
import { OfferService } from '../offer.service';

@Component({
  selector: 'app-employer-summary',
  templateUrl: './employer-summary.component.html',
  styleUrls: ['./employer-summary.component.scss']
})
export class EmployerSummaryComponent implements OnInit {
  offers: any=[];
  date: any;
  group:any;
  salary: any;
  unique: any = [];
  _sal: any = [];
  _from:any;
  _to:any;
  _grp_name:any;
  constructor(private router: Router, private service: OfferService) { }

  ngOnInit() {
     $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });

    //group

   

    //salary

   
    this.bind();

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

  detail(id) {
    this.router.navigate(['/employer/manage_offer/offerdetail/' + id]);
  }

  edit(id) {
    this.router.navigate(['/employer/manage_offer/addoffer/' + id]);
  }

  delete(id) {
    this.service.deactivate_offer(id).subscribe(res => {
        // this.offers = res['data'];
        console.log('res',res);
        
        // console.log("deactivate",this.offers);
        this.bind();
    })
   }

  onAdd() {
  //  var user_id = localStorage.getItem('userid')
  //   console.log("user_id",user_id);
    
    this.router.navigate(['/employer/manage_offer/addoffer/0']);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public bind() {
    this.service.get_salary_brcaket().subscribe(res => {
      this.salary = res['data']['data'];
      this.salary = this.salary.filter(x => x.is_del === false);
      console.log(this.salary);

    })

    this.service.get_groups().subscribe(res => {
      this.group = res['data']['data'];

      // this.group = this.group.filter(x => x._id === this.offers.group);
      console.log(this.group);
    })

    this.service.view_offer()
      .subscribe(res => {
        this.offers = res['data']['data'];
        this.offers = this.offers.filter(x => x.is_del === false);

        this.offers.filter(x => {
          this.date = x.createdAt.split("T");
        });

      
        
      //   this.salary.forEach(element => {
      //     let fetch_salary = element._id;
      //     console.log('fetch', fetch_salary);

      //     this.unique = this.salary.filter(x => x._id === fetch_salary);
      //     console.log('unique', this.unique);

      //     this._sal.push(this.unique[0]);
      //     console.log('_cnt', this._sal);
      //   });
      //   this._sal = this._sal.filter(this.onlyUnique);
      })
  }

  public GetSalary(from) {

    this._from = this.salary.filter(x => x._id === from);
    this._from = this._from[0].from;
    this._to = this.salary.filter(x => x._id === from);
    this._to = this._to[0].to;
    return this._from ,this._to
  }

  public GetGroup(group_name){
    this._grp_name = this.group.filter(x => x._id === group_name);
    this._grp_name = this._grp_name[0].name;
    return  this._grp_name
  }
}
