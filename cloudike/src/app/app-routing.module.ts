import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OauthComponent } from './oauth/oauth.component';
import { DriveComponent } from './drive/drive.component';
import { NavBarComponent } from './drive/nav-bar/nav-bar.component';
import { NavTreeComponent } from './drive/nav-tree/nav-tree.component';
import { BootComponent } from './boot/boot.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';

const routes: Routes = [
  { 
    path: 'oauth',  
    component: OauthComponent 
  }, 

  { 
    path: 'drive',  
    component: MainLayoutComponent, 
    data:{
      top:NavBarComponent, // 상단에 표시될 아이콘 컴포넌트
      left:NavTreeComponent, // 좌측에 표시될 메뉴 컴포넌트
      main:DriveComponent, // 메인 컨텐츠
    }, 
    // children을 설정할 경우 drive/로 시작하는 모든 경로가 라우팅됨. (drive/폴더/파일  형식으로 접근하기 위함)
    children:[{
      path:"**", component:MainLayoutComponent // 여기의 컴포넌트는 route되지 않으므로 의미 없음.
  }]}, 

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
