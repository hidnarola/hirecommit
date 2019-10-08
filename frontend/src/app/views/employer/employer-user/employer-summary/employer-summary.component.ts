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
  offers: any = [];
  date: any;
  group: any;
  salary: any;
  unique: any = [];
  _sal: any = [];
  _from: any;
  _to: any;
  _grp_name: any;
  status = true;
  constructor(private router: Router, private service: OfferService) { }

  ngOnInit() {
     $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
          this.nextButtonClickEvent();
        });
      }
    });

    setTimeout(() => {

      this.bind();
    }, 100);

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
        console.log('res', res);

        // console.log("deactivate",this.offers);
        this.bind();
    });
   }

  checkValue(id, e) {
      this.status = e.target.checked;
      console.log('updated', this.status);
     this.service.change_status(id, this.status).subscribe(res => {
       console.log('updated12', this.status);
     });
  }

   onAdd() {
    this.router.navigate(['/employer/manage_offer/addoffer/0']);
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  public bind() {
    this.service.view_offer().subscribe(res => {
      console.log(res['data']);
      this.offers = res['data'];
    });

    // this.service.get_groups().subscribe(res => {
    //   this.group = res['data']['data'];

    //   // this.group = this.group.filter(x => x._id === this.offers.group);
    //   console.log('grou[ps', this.group);
    // });

    // this.service.view_offer()
    //   .subscribe(res => {
    //     this.offers = res['data']['data'];
    //     this.offers = this.offers.filter(x => x.is_del === false);
    //    console.log(this.offers);


    //     this.offers.filter(x => {
    //       this.date = x.createdAt.split('T');
    //     });
    //   });
  }

  public GetSalary(from) {
    // this._from = this.salary.filter(x => x._id === from);
    // this._from = this._from[0].from;
    // this._to = this.salary.filter(x => x._id === from);
    // this._to = this._to[0].to;
    // return this._from , this._to;
  }

  public GetGroup(group_name) {
    // this._grp_name = this.group.filter(x => x._id === group_name);
    // if (this._grp_name.length === 0) {
    //   this._grp_name = 'Not Available';
    // } else {
    //   this._grp_name = this._grp_name[0].name;
    // }
    // return  this._grp_name;
  }
}
