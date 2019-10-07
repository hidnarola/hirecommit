import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageGroupsRoutingModule } from './manage-groups-routing.module';
import { ViewGroupsComponent } from './view-groups/view-groups.component';
import { AddGroupsComponent } from './add-groups/add-groups.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GroupsDetailsComponent } from './groups-details/groups-details.component';
import { GroupsComponent } from './groups/groups.component';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [ViewGroupsComponent, AddGroupsComponent, GroupsDetailsComponent, GroupsComponent],
  imports: [
    CommonModule,
    ManageGroupsRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    DataTablesModule
  ],
  providers: [  ]
})
export class ManageGroupsModule { }
