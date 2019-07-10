import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { OauthComponent } from './oauth/oauth.component';
import { BootComponent } from './boot/boot.component';
import { HttpClientModule } from  '@angular/common/http';

import { HeaderDriveComponent } from './drive/header-drive/header-drive.component';
import { NavDriveComponent } from './drive/nav-drive/nav-drive.component';
import { DriveComponent } from './drive/drive.component';
import { FolderItemComponent } from './drive/nav-drive/folder-item/folder-item.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './setting/profile/profile.component';
import { NavSettingComponent } from './setting/nav-setting/nav-setting.component';
import { HeaderSettingComponent } from './setting/header-setting/header-setting.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [BootComponent]
})
export class AppModule { }
