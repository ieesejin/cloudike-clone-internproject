import { Component, OnInit, Input } from '@angular/core';
import { FileItem } from 'src/app/drive/FileItem';
import { DriveComponent } from '../../drive.component';
import { HttpClient } from '@angular/common/http';
import { FileManagement } from '../../FileManagement';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.css']
})
export class FolderItemComponent implements OnInit {

  @Input() url: string;
  @Input() name: string;
  @Input() depth: number;
  @Input() click_event;
  item : FileItem = new FileItem(null);
  content_hide = true;

  get now():boolean {
    return DriveComponent.Now.path == this.url;
  }

  constructor(private http: HttpClient, private router: Router) { 
    router.events.subscribe( (event) => {

      if (event instanceof NavigationEnd) {
          // Show loading indicator
          this.Update();
      }
  });
  }

  ngOnInit() {
    this.Update();
  }

  private Update()
  {
    // 이 아이템이 현재 경로에 있는 아이템일 경우 자동으로 클릭 효과
    let routerurl = decodeURI(this.router.url.substring("/drive".length));
    let folder = FileItem.SplitPath(routerurl);
    folder.forEach(element => {
      if (this.url == element.path)
      {
        this.itemclick(true);
      }
    });
  }

  // value은 하위 목록을 열것인지, 열지 않을 것인지
  public itemclick(value)
  {
    FileManagement.getItem(this.http, this.url, (item)=>{
      this.item = item;
      if (value == true)
        this.content_hide = false;
      else
        this.content_hide = !this.content_hide;
    });
  }
}
