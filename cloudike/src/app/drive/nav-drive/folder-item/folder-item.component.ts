import { Component, OnInit, Input } from '@angular/core';
import { FileItem } from 'src/app/drive/FileItem';
import { DriveComponent } from '../../drive.component';
import { FileManagement } from '../../FileManagement';
import { Router, NavigationEnd } from '@angular/router';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { ValueStorageService } from 'src/app/service/ValueStorage/value-storage.service';
import { ToastrService } from 'ngx-toastr';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

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

  constructor(public hs: HTTPService, private router: Router, public valueStorage : ValueStorageService, private api : CloudikeApiService) { 
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
        this.itemclick(null, true);
      }
    });
  }

  // value은 하위 목록을 열것인지, 열지 않을 것인지
  public itemclick(event, value)
  {
    if (event != null)
    {
      event.stopPropagation();
      console.log("A");
    }
    FileManagement.getItem(this.hs, this.url, (item)=>{
      this.item = item;
      if (value == true)
        this.content_hide = false;
      else
        this.content_hide = !this.content_hide;
    });
  }
  
  public delete_file(url)
  {
    this.api.Delete(url);
  }
  public move_file()
  {
  }
  public rename_file()
  {
  }
  public share_file(item)
  {
  }
}

