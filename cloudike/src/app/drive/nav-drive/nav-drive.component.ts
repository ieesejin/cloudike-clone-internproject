import { Component, OnInit } from '@angular/core';
import { ValueStorageService } from 'src/app/service/ValueStorage/value-storage.service';
import { FileItem } from '../FileItem';
import { Router } from '@angular/router';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { FileManagement } from '../FileManagement';


@Component({
  selector: 'app-nav-drive',
  templateUrl: './nav-drive.component.html',
  styleUrls: ['./nav-drive.component.css']
})
export class NavDriveComponent implements OnInit {
  constructor(private valueStorage: ValueStorageService, private router: Router, private hs: HTTPService) { }

  public favorite_hide: boolean = false;
  private last_list = [];
  public get favoriteList() {
    return this.valueStorage.GetValues(
      "favoriteList",
      item => {
        return item.key.indexOf("?favorite") > 0 && item.value == "true";
      },
      item => {
        var folder = FileItem.SplitPath(item.key);
        return folder[folder.length - 1];
      }
    )
  }

  public itemClick(path) {

    FileManagement.getItem(this.hs, path, (item: FileItem) => {
      if (item.isfolder) {
        this.router.navigate(["/drive" + path]);
      } else {
        item.Download(this.hs);
      }
    }, true);

  }
  ngOnInit() {
  }


}
