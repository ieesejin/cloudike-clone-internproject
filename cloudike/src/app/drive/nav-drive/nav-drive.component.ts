import { Component, ViewChild, OnInit } from '@angular/core';
import { ValueStorageService } from 'src/app/service/ValueStorage/value-storage.service';
import { FileItem } from '../FileItem';
import { Router } from '@angular/router';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { FileManagement } from '../FileManagement';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

@Component({
  selector: 'app-nav-drive',
  templateUrl: './nav-drive.component.html',
  styleUrls: ['./nav-drive.component.css']
})
export class NavDriveComponent implements OnInit {
  constructor(private valueStorage: ValueStorageService, public router: Router, public hs: HTTPService, private api : CloudikeApiService) { }

  public favorite_hide : boolean = false;

  public keepOriginalOrder = (a, b) => a.key;

  public get favoriteList() {
    return this.api.GetFavoritesList(this.valueStorage);
  }

  public itemClick(item : FileItem) {
    if (item.isfolder) {
      this.router.navigate(["/drive" + item.path]);
    } else {
      item.Download(this.hs);
    }
  }

  public deleteFavorite(item : FileItem)
  {
    this.api.SetFavoriteOfItem(this.valueStorage,item,false);
  }

  public resetFavoritesList()
  {
    var list = this.api.GetFavoritesList(this.valueStorage);
    Object.values(list).forEach((item : FileItem) => {
      this.deleteFavorite(item);
    });
  }
  ngOnInit() {
  }


}
