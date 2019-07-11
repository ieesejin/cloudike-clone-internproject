import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ViewEncapsulation } from '@angular/core';
import { UserInfo } from '../UserInfo';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FileManagement } from '../drive/FileManagement';
import { RealtimeService } from '../realtime.service';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./header.css', 'nav.css', './main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  @ViewChild('top', { read: ViewContainerRef ,static:true}) top: ViewContainerRef;
  @ViewChild('left', { read: ViewContainerRef ,static:true}) left: ViewContainerRef;
  @ViewChild('main', { read: ViewContainerRef ,static:true}) main: ViewContainerRef;

  constructor(
    private router : Router, 
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private http: HttpClient,
    private realservice : RealtimeService)
  {
      UserInfo.Update(http);
  }

  private createComponent(view:ViewContainerRef, component)
  {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    view.createComponent(componentFactory);
  }

  ngOnInit(){
    this.route.data
        .subscribe(data => {
          if (!!data)
          {
            this.createComponent(this.top, data.top);
            this.createComponent(this.left, data.left);
            this.createComponent(this.main, data.main);
          }
    });
  }
  get user_name()
  {
     return UserInfo.user_name
  };
  get storageSize()
  {
    return FileManagement.byteToString(UserInfo.storageSize);
  }
  get maxStorageSize()
  {
    return FileManagement.byteToString(UserInfo.maxStorageSize);;
  }
  get remainStorageSize()
  {
    return FileManagement.byteToString(UserInfo.maxStorageSize-UserInfo.storageSize);
  }
  get storagePercent()
  {
    if(UserInfo.maxStorageSize == 0) return 0;
    return UserInfo.storageSize * 100 / UserInfo.maxStorageSize;
  }
}
