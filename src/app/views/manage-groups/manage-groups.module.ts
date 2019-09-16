import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageGroupsRoutingModule } from './manage-groups-routing.module';
import { ViewGroupsComponent } from './view-groups/view-groups.component';
import { AddGroupsComponent } from './add-groups/add-groups.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [ViewGroupsComponent, AddGroupsComponent],
  imports: [
    CommonModule,
    ManageGroupsRoutingModule, ReactiveFormsModule, CKEditorModule
  ]
})
export class ManageGroupsModule { }
