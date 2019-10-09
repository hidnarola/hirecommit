import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EmployerService } from '../employer.service';

@Component({
  selector: 'app-employer-detail',
  templateUrl: './employer-detail.component.html',
  styleUrls: ['./employer-detail.component.scss']
})
export class EmployerDetailComponent implements OnInit {
  approval: boolean =  false;
  id: any;
  employer_detail : any;
  name : any=[];
  form = false;
  constructor(private router: Router,private service: EmployerService,private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    })

    this.service.getemployerDetail(this.id).subscribe(res => {
      this.employer_detail = res['data'];
      this.form =true;
      console.log('details >>',this.employer_detail);
      
      this.name = this.employer_detail.username.split(' ');
      console.log('name >>', this.name);
   
    })
  }

  cancel() {
    this.router.navigate(['admin/employer_manage/view']);
  }

  approve() {
    this.approval = true;
  }

  unapprove() {
    this.approval = false;
  }
}
