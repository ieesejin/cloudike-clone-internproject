import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { OauthComponent } from './oauth/oauth.component';
import { BootComponent } from './boot/boot.component';
import { HttpClientModule } from  '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { NavBarComponent } from './drive/nav-bar/nav-bar.component';
import { NavTreeComponent } from './drive/nav-tree/nav-tree.component';
import { DriveComponent } from './drive/drive.component';
import { FolderItemComponent } from './drive/nav-tree/folder-item/folder-item.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

@NgModule({
  declarations: [
    OauthComponent,
    BootComponent,
    NavBarComponent,
    NavTreeComponent,
    DriveComponent,
    FolderItemComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [CookieService],
  bootstrap: [BootComponent]
})
export class AppModule { }
