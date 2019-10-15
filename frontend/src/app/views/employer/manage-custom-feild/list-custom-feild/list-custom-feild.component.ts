import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { CustomFeildService } from '../customFeild.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
@Component({
  selector: 'app-list-custom-feild',
  templateUrl: './list-custom-feild.component.html',
  styleUrls: ['./list-custom-feild.component.scss']
})
export class ListCustomFeildComponent implements OnInit {
data: any[];
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private confirmationService: ConfirmationService,
    private service : CustomFeildService,
    private router: Router) { }

  ngOnInit() {
    console.log(' list feild component');
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
          console.log(' res 1 ===>' , res);
          
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

  delete() {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        // this.service.deactivate_location(id).subscribe(res => {
        //   console.log('deactivate location', res);
        //   // this.bind();
        // });
      }
    });
  }
  onEdit(id){
    this.router.navigate(['/employer/customfeild/edit/' + id])
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

 