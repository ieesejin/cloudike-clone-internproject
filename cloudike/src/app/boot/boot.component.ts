import { Component, OnInit, ViewChild, ViewRef, ElementRef } from '@angular/core';
import { UserInfo } from '../UserInfo';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HTTPService } from '../httpservice.service';
import { NgxDragAndDropDirective } from '@wkoza/ngx-upload/src/directives/dropzone.directive';
import { FileItem } from '../drive/FileItem';
@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.css']
})
export class BootComponent implements OnInit {
  @ViewChild('upload',{static: true}) public upload : ElementRef;
  @ViewChild(NgxDragAndDropDirective,{static: true}) public ngx_upload;
  public upload_class_list;
  constructor(private router: Router, private location: Location, private hs: HTTPService) { 
    // this.router.url is not working (because of no loading, BootComponent is working in bootstrap)
    // So use location class.
    let path = this.location.path();

    // 만약 유저가 로그인한 상태라면
    if (UserInfo.isLogin())
    {
      // 루트를 가르키고 있다면 drive 페이지로 안내
      if (path == "")
        this.router.navigate(['/drive']);
    }
    else
    {
      // 로그인을 하지 않았으면 무조건 oauth 페이지로 안내
      if (path.indexOf("/oauth") != 0)
        this.router.navigate(['/oauth']);
    }
  }

  get dragover()
  {
    if (this.upload_class_list.contains('dropZoneColorDrag'))
      return true;

    return new Date().getTime() - this.ngx_upload.last_dragover < 100;
  }

  get thisfolder()
  {
      var folder = FileItem.SplitPath(decodeURI(this.router.url.substring("/drive".length)));
      return folder[folder.length - 1].name;
  }
  ngOnInit() {
    this.upload_class_list = this.upload.nativeElement.classList;
  }
  
}
