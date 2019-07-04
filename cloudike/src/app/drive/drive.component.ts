import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DriveComponent implements OnInit {

  public static Root :FileItem;
  public Now :FileItem = new FileItem(null);
  public keepOriginalOrder = (a, b) => a.key;
  public ParantFolder = [];

  constructor(private http:HttpClient, private router : Router) { 
    router.events.subscribe( (event) => {

      if (event instanceof NavigationEnd) {
          // Show loading indicator
          this.Update();
      }
  });
  }

  ngOnInit() {
    
  }
  private Update()
  {      
    let url = this.router.url.substring("/drive".length);
    if (url[0] == '/') url = url.substring(1);

    this.http.get("https://api.cloudike.kr/api/1/metadata/" + url + "?limit=500&offset=0&order_by=name",{
      headers: {'Mountbit-Auth':UserInfo.token()}
    }).subscribe(data => {
        DriveComponent.Root = new FileItem(data);
        this.Now = new FileItem(data);
        this.ParantFolder = [];
        let path = "/drive";
        this.ParantFolder.push({name:"내 Cloudike", path:path})

        if (url.length > 0)
        {
          let temp = decodeURI(url).split('/');
          temp.forEach(element => {
            path += "/" + element;
            this.ParantFolder.push({name:element, path:path})
          });
        }
    });

  }

}
