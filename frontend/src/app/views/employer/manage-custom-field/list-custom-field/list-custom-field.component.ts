import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomFieldService } from '../custom-field.service';
@Component({
  selector: 'app-list-custom-field',
  templateUrl: './list-custom-field.component.html',
  styleUrls: ['./list-custom-field.component.scss']
})
export class ListCustomFieldComponent implements OnInit {
  data: any[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private confirmationService: ConfirmationService,
    private toastr: ToastrService,
    private service: CustomFieldService,
    private router: Router) { }

  ngOnInit() {
    console.log(' list field component');
    this.bind();
  }

  public bind() {
    console.log(' bind function ');

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      destroy: true,
      ajax: (dataTablesParameters: any, callback) => {
        console.log('dataTablesParameters', dataTablesParameters);
        this.service.view_custom_feild(dataTablesParameters).subscribe(res => {
          console.log(' res 1 ===>', res);

          if (res['status'] === 1) {
            this.data = res['data'];
            console.log('custom_data==>', res);


            callback({ recordsTotal: res['recordsTotal']['recordsTotal'], recordsFiltered: res['recordsTotal']['recordsTotal'], data: [] });
          }
        }, err => {
          callback({ recordsTotal: 0, recordsFiltered: 0, data: [] });
        });
      },
      columns: [
        {
          data: 'key'
        },
        {
          data: 'action'
        }
      ]
    };
  }

  delete(id) {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        console.log('idid', id);

        // this.service.delete_custom_field(id).subscribe(res => {
        //    console.log('deleted',res);

        //   if (res['data']['status'] === 1) {

        //     this.toastr.success(res['message'], 'Success!', { timeOut: 3000 });

        //   }
        //    this.rrerender();
        // } ,(err) => {
        //   console.log('error msg ==>', err['error']['message']);

        //   this.toastr.error(err['error']['message'][0].msg, 'Error!', { timeOut: 3000 });
        // })
          }
    });
  }
  onEdit(id) {
    this.router.navigate(['/employer/custom_field/edit/' + id]);
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
