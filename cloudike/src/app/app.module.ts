import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { OauthComponent } from './oauth/oauth.component';
import { BootComponent } from './boot/boot.component';
import { HttpClientModule } from  '@angular/common/http';

import { NavBarComponent } from './drive/nav-bar/nav-bar.component';
import { NavTreeComponent } from './drive/nav-tree/nav-tree.component';
import { DriveComponent } from './drive/drive.component';
import { FolderItemComponent } from './drive/nav-tree/folder-item/folder-item.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    OauthComponent,
    BootComponent,
    NavBarComponent,
    NavTreeComponent,
    DriveComponent,
    FolderItemComponent,
    MainLayoutComponent,
    LogoutComponent,
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
