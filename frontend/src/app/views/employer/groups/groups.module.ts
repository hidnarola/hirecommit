import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { GroupAddEditComponent } from './group-add-edit/group-add-edit.component';
import { CommunicationViewComponent } from './communication-view/communication-view.component';
import { CommunicationAddEditComponent } from './communication-add-edit/communication-add-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [
    GroupsListComponent,
    GroupAddEditComponent,
    CommunicationViewComponent,
    CommunicationAddEditComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    DataTablesModule,
    ConfirmDialogModule
  ],
  providers: [ConfirmationService]
})
export class GroupsModule { }
