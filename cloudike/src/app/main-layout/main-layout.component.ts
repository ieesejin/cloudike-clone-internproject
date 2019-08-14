import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ViewEncapsulation } from '@angular/core';
import { UserInfo } from '../UserInfo';
import { Router, ActivatedRoute } from '@angular/router';
import { RealtimeService } from '../realtime.service';
import { ConvertFormat } from '../drive/ConvertFormat';
import { HTTPService } from '../httpservice.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./header.css', 'nav.css', './main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  public static UpdatePosition : Subject<any>;
  @ViewChild('top', { read: ViewContainerRef, static: true }) top: ViewContainerRef;
  @ViewChild('left', { read: ViewContainerRef, static: true }) left: ViewContainerRef;
  @ViewChild('main', { read: ViewContainerRef, static: true }) main: ViewContainerRef;

  public extra_open = true;
  public opened = true;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver,
    private hs: HTTPService,
    private realservice: RealtimeService) {
    UserInfo.Update(hs);
    MainLayoutComponent.UpdatePosition = new Subject<any>();
  }

  public extra_toggle()
  {
    this.extra_open = ! this.extra_open;
    setTimeout(()=>{

      MainLayoutComponent.UpdatePosition.next();

    }, 500);
  }
  public get windows_width() {
    return window.innerWidth;
  }
  public get companyName() {
    return UserInfo.companyName;
  }
  private createComponent(view: ViewContainerRef, component) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    view.createComponent(componentFactory);
  }

  ngOnInit() {
    this.route.data
      .subscribe(data => {
        if (!!data) {
          this.createComponent(this.top, data.top);
          this.createComponent(this.left, data.left);
          this.createComponent(this.main, data.main);
        }
      });
  }
  get user_name() {
    return UserInfo.user_name
  };
  get storageSize() {
    return ConvertFormat.byteToString(UserInfo.storageSize);
  }
  get maxStorageSize() {
    return ConvertFormat.byteToString(UserInfo.maxStorageSize);;
  }
  get remainStorageSize() {
    return ConvertFormat.byteToString(UserInfo.maxStorageSize - UserInfo.storageSize);
  }
  get storagePercent() {
    if (UserInfo.maxStorageSize == 0) return 0;
    return UserInfo.storageSize * 100 / UserInfo.maxStorageSize;
  }
}
