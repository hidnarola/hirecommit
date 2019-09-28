import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { GroupService } from '../manage-groups.service';

@Component({
  selector: 'app-view-groups',
  templateUrl: './view-groups.component.html',
  styleUrls: ['./view-groups.component.scss']
})
export class ViewGroupsComponent implements OnInit {
  groups: any;
  viewInfo: FormGroup;
  constructor(private router: Router, private service: GroupService) { }
  ngOnInit() {
    const table = $('#example').DataTable({
      drawCallback: () => {
        $('.paginate_button.next').on('click', () => {
            this.nextButtonClickEvent();
          });
      }
    });

    this.bind();  }

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
    this.router.navigate(['/employer/manage_group/group_details']);
   }

   edit() {
    this.router.navigate(['/employer/manage_group/add_group']);
   }

   delete() {}

   onAdd() {
     this.router.navigate(['/groups/addgroup']);
   }

   onclick() {

this.router.navigate(['/employer/manage_group/group']);

   }

   onaddDetails(id) {
    this.router.navigate(['/employer/manage_group/add_group/' + id]);
   }

    public bind() {
      this.service.view_groups().subscribe(res => {
        // console.log(res);return false;
        
        this.groups = res['data']['data'];
        console.log('groups', this.groups);
      });
    }

}
