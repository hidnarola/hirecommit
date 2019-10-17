import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
// import Swal from 'sweetalert2';
import { GroupService } from '../manage-groups.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-groups',
  templateUrl: './view-groups.component.html',
  styleUrls: ['./view-groups.component.scss']
})
export class ViewGroupsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  viewInfo: FormGroup;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  groups: any[];

  constructor(private router: Router, private service: GroupService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.bind();
  }

  detail(id) {
    this.router.navigate(['/employer/groups/group_details/' + id]);
  }

  edit(id) {
    this.router.navigate(['employer/groups/edit/' + id]);
  }

  delete(id) {
    this.service.deleteGroup(id).subscribe(res => {
      if (res['status']) {
        this.toastr.success(res['message'], 'Succsess!', { timeOut: 3000 });
        this.rrerender();
        this.bind();
      }
    }, (err) => {
      this.toastr.error(err['error'].message, 'Error!', { timeOut: 3000 });
    });
  }

  onAdd() {
    this.router.navigate(['/groups/addgroup']);
  }

  onclick() {
    this.router.navigate(['/employer/groups/add']);
  }

  onaddDetails(id) {
    this.router.navigate(['/employer/groups/add_comunication/' + id]);
  }

  public bind() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      language: { 'processing': '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>' },
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log('dataTablesParameters', dataTablesParameters);
        this.service.lists(dataTablesParameters).subscribe(res => {
          if (res['status']) {
            this.groups = res['groups'];
            console.log('data==>', res);
            callback({ recordsTotal: res[`recordsTotal`], recordsFiltered: res[`recordsTotal`], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      }, columnDefs: [{ orderable: false, targets: 7 }],
      columns: [
        {
          data: 'name'
        }, {
          data: 'high_unopened'
        }, {
          data: 'high_notreplied'
        },
        {
          data: 'medium_unopened'
        },
        {
          data: 'medium_notreplied'
        },
        {
          data: 'low_unopened'
        },
        {
          data: 'low_notreplied'
        },
        {
          data: 'actions'
        }
      ]
    };
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
