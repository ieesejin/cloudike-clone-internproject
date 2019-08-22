import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OauthComponent } from './login/oauth/oauth.component';
import { DriveComponent } from './drive/drive.component';
import { HeaderDriveComponent } from './drive/header-drive/header-drive.component';
import { NavDriveComponent } from './drive/nav-drive/nav-drive.component';
import { BootComponent } from './boot/boot.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { LogoutComponent } from './logout/logout.component';
import { NavSettingComponent } from './setting/nav-setting/nav-setting.component';
import { ProfileComponent } from './setting/profile/profile.component';
import { HeaderSettingComponent } from './setting/header-setting/header-setting.component';
import { SingUpComponent } from './login/sing-up/sing-up.component';
import { HeaderFavoritesComponent } from './drive/header-favorites/header-favorites.component';
import { TrashHeaderComponent } from './drive/trash-header/trash-header.component';

const routes: Routes = [
  { 
    path: 'oauth',  
    component: OauthComponent 
  },

  {
    path: 'sign-up',
    component: SingUpComponent
  },
    
  { 
    path: 'logout',  
    component: LogoutComponent
  },

  { 
    path: 'drive',  
    component: MainLayoutComponent, 
    data:{
      top:HeaderDriveComponent, // 상단에 표시될 아이콘 컴포넌트
      left:NavDriveComponent, // 좌측에 표시될 메뉴 컴포넌트
      main:DriveComponent, // 메인 컨텐츠
    }, 
    // children을 설정할 경우 drive/로 시작하는 모든 경로가 라우팅됨. (drive/폴더/파일  형식으로 접근하기 위함)
    children:[{
      path:"**", component:MainLayoutComponent // 여기의 컴포넌트는 route되지 않으므로 의미 없음.
  }]}, 

  {
    path: 'trash',  
    component: MainLayoutComponent, 
    data:{
      top:TrashHeaderComponent, // 상단에 표시될 아이콘 컴포넌트
      left:NavDriveComponent, // 좌측에 표시될 메뉴 컴포넌트
      main:DriveComponent // 메인 컨텐츠
    }
  },

  {
    path: 'favorites',  
    component: MainLayoutComponent, 
    data:{
      top:HeaderFavoritesComponent, // 상단에 표시될 아이콘 컴포넌트
      left:NavDriveComponent, // 좌측에 표시될 메뉴 컴포넌트
      main:DriveComponent // 메인 컨텐츠
    }
  },

  { 
    path: 'profile',  
    component: MainLayoutComponent, 
    data:{
      top:HeaderSettingComponent, // 상단에 표시될 아이콘 컴포넌트
      left:NavSettingComponent, // 좌측에 표시될 메뉴 컴포넌트
      main:ProfileComponent, // 메인 컨텐츠
    }, 
  }, 

  { 
    path: '',  
    component: BootComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
