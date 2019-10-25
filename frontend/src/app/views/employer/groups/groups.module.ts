import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HttpClientModule } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { GroupAddComponent } from './group-add/group-add.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { InputSwitchModule } from 'primeng/inputswitch';
// import { GroupViewComponent } from './group-view/group-view.component';

@NgModule({
  declarations: [
    GroupsListComponent,
    GroupAddComponent,
    GroupEditComponent,
    // GroupViewComponent
  ],
  imports: [
    CommonModule,
    GroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    HttpClientModule,
    DataTablesModule,
    ConfirmDialogModule,
    InputSwitchModule
  ],
  providers: [ConfirmationService]
})
export class GroupsModule { }
