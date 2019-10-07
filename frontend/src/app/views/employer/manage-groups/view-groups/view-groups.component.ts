import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
// import Swal from 'sweetalert2';
import { GroupService } from '../manage-groups.service';
import { Subject } from 'rxjs';
import {DataTableDirective} from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-groups',
  templateUrl: './view-groups.component.html',
  styleUrls: ['./view-groups.component.scss']
})
export class ViewGroupsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  viewInfo: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger:  Subject<any> = new Subject();
  groups: any[];

  constructor(private router: Router, private service: GroupService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      destroy: true
    };
    this.bind();
  }

  detail(id) {
    this.router.navigate(['/employer/manage_group/group_details/' + id]);
   }

   edit() {
    this.router.navigate(['/employer/manage_group/add_group']);
   }

   delete(id) {
     this.service.deleteGroup(id).subscribe(res => {
      if (res['status']) {
        this.toastr.success(res['message'], 'Succsess!', {timeOut: 3000});
        this.rrerender();
        this.bind();
      }
     }, (err) => {
        this.toastr.error(err['error'].message, 'Error!', {timeOut: 3000});
     });
   }

   onAdd() {
     this.router.navigate(['/groups/addgroup']);
   }

   onclick() {
    this.router.navigate(['/employer/manage_group/group']);
   }

   onaddDetails(id) {
    this.router.navigate(['/employer/manage_group/add_group/' + id ]);
   }

    public bind() {
      this.service.view_groups().subscribe(res => {
        this.groups = res['data']['data'];
        // console.log('groups', this.groups);
        this.dtTrigger.next();
      });
    }

    ngAfterViewInit(): void {
      this.dtTrigger.next();
    }

    ngOnDestroy() {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    }

    rrerender(): void {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }

}
