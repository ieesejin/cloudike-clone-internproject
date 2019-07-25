import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from 'ngx-contextmenu';

import { DragDropModule } from '@angular/cdk/drag-drop';


import { AppRoutingModule } from './app-routing.module';
import { OauthComponent } from './oauth/oauth.component';
import { BootComponent } from './boot/boot.component';
import { HttpClientModule } from  '@angular/common/http';
import {NgxUploadModule} from '@wkoza/ngx-upload/src';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { HeaderDriveComponent } from './drive/header-drive/header-drive.component';
import { NavDriveComponent } from './drive/nav-drive/nav-drive.component';
import { DriveComponent } from './drive/drive.component';
import { FolderItemComponent } from './drive/nav-drive/folder-item/folder-item.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './setting/profile/profile.component';
import { NavSettingComponent } from './setting/nav-setting/nav-setting.component';
import { HeaderSettingComponent } from './setting/header-setting/header-setting.component';
import { NewFolderComponent } from './drive/new-folder/new-folder.component';
import { ngxDropTargetOptions } from './file-upload-option';
import { UploadBoxComponent } from './upload-box/upload-box.component';
import { DeleteFilesComponent } from './drive/delete-files/delete-files.component';
import { MoveFileComponent } from './drive/move-file/move-file.component';

@NgModule({
  declarations: [
    OauthComponent,
    BootComponent,
    HeaderDriveComponent,
    NavDriveComponent,
    DriveComponent,
    FolderItemComponent,
    MainLayoutComponent,
    LogoutComponent,
    ProfileComponent,
    NavSettingComponent,
    HeaderSettingComponent,
    NewFolderComponent,
    UploadBoxComponent,
    DeleteFilesComponent,
    MoveFileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    NgxUploadModule.forRoot(ngxDropTargetOptions),
    NgbModule,
    DragDropModule,
    ContextMenuModule.forRoot({
      useBootstrap4: true
    })
  ],
  providers: [],
  bootstrap: [BootComponent],
  entryComponents: [ NewFolderComponent, DeleteFilesComponent, MoveFileComponent ]
})
export class AppModule { }
