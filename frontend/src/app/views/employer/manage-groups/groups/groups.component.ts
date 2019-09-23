import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  addGroup: FormGroup;
  submitted = false;
  constructor(private router: Router) { }

  ngOnInit() {

    this.addGroup = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    
    });
  }

  get f() {return  this.addGroup.controls;}

  onSubmit(flag: boolean) {
    this.submitted = !flag;
    console.log(this.addGroup.value);

  if (flag) {
    // this.addAccount.reset();
    // this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }
  }

  onClose() {
    // this.router.navigate(['/employer/manage_subaccount/view_subaccount']);
  }
}
