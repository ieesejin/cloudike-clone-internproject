import { Component, OnInit } from '@angular/core';
import { ValueStorageService } from 'src/app/value-storage.service';
import { FileItem } from '../FileItem';
import { Router } from '@angular/router';
import { HTTPService } from 'src/app/httpservice.service';
import { FileManagement } from '../FileManagement';


@Component({
  selector: 'app-nav-drive',
  templateUrl: './nav-drive.component.html',
  styleUrls: ['./nav-drive.component.css']
})
export class NavDriveComponent implements OnInit {
  constructor(private valueStorage: ValueStorageService, private router: Router, private hs:HTTPService) { }

  public favorite_hide : boolean = false;
  private last_list = [];
  public get favoriteList() {
    // 렉 유발 가능성
    var list = [];
    this.valueStorage.GetValues().forEach(element => {
      if (element.key.indexOf("?favorite") > 0 && element.value == "true") {
        var folder = FileItem.SplitPath(element.key);
        list.push(folder[folder.length - 1]);
      }
    });
    // 변화가 있으면 last_list 업데이트
    if (this.last_list.length != list.length) {
      this.last_list = list;
    }
    else {
      for (var i = 0; i < this.last_list.length; i++) {
        if (this.last_list[i].path != list[i].path) {
          this.last_list = list;
          return this.last_list;
        }
      }
    }
    return this.last_list;
  }

  public itemClick(path)
  {

    FileManagement.getItem(this.hs,path,(item:FileItem)=>{
      if (item.isfolder)
      {
        this.router.navigate(["/drive" + path]);
      } else
      {
        item.Download(this.hs);
      }
    },true);

  }
  ngOnInit() {
  }


}
