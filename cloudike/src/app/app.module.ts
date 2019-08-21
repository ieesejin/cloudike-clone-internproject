import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatFormFieldModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContextMenuModule } from 'ngx-contextmenu';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragToSelectModule } from 'ngx-drag-to-select/projects/ngx-drag-to-select/src/public_api';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { BootComponent } from './boot/boot.component';
import { HttpClientModule } from  '@angular/common/http';
import {NgxUploadModule} from '@wkoza/ngx-upload/src';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';

import { HeaderDriveComponent } from './drive/header-drive/header-drive.component';
import { NavDriveComponent } from './drive/nav-drive/nav-drive.component';
import { DriveComponent } from './drive/drive.component';
import { FolderItemComponent } from './drive/nav-drive/folder-item/folder-item.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './setting/profile/profile.component';
import { NavSettingComponent } from './setting/nav-setting/nav-setting.component';
import { HeaderSettingComponent } from './setting/header-setting/header-setting.component';
import { NewFolderComponent } from './drive/dialog/new-folder/new-folder.component';
import { ngxDropTargetOptions } from './file-upload-option';
import { UploadBoxComponent } from './upload-box/upload-box.component';
import { DeleteFilesComponent } from './drive/dialog/delete-files/delete-files.component';
import { MoveFileComponent } from './drive/dialog/move-file/move-file.component';
import { RenameComponent } from './drive/dialog/rename/rename.component';
import { MatNativeDateModule} from '@angular/material';
import { ShareComponent } from './drive/dialog/share/share.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SingUpComponent } from './login/sing-up/sing-up.component';
import { OauthComponent } from './login/oauth/oauth.component';

import 'hammerjs';
import { HeaderFavoritesComponent } from './drive/header-favorites/header-favorites.component';
import { DeleteFavoritesComponent } from './drive/dialog/delete-favorites/delete-favorites.component';

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
    RenameComponent,
    ShareComponent,
    SingUpComponent,
    HeaderFavoritesComponent,
    DeleteFavoritesComponent,
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
    }),
    MatDatepickerModule,
    MatFormFieldModule , MatNativeDateModule,
    MatMenuModule,
    MatTooltipModule,
    DragToSelectModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center'
    }),
    MatSidenavModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [MatDatepickerModule],
  bootstrap: [BootComponent],
  entryComponents: [ NewFolderComponent, DeleteFilesComponent, MoveFileComponent
    , RenameComponent, ShareComponent, DeleteFavoritesComponent ]
})
export class AppModule { }
