import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';

@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})
export class DriveComponent implements OnInit {

  public Root :FileItem;
  public Now = [];
  public Now_Path = "";
  constructor(private http:HttpClient) { 

    this.LoadFolder("");
  }

  ngOnInit() {
    
  }
  private LoadFolder(path: string)
  {
    this.http.get("https://api.cloudike.kr/api/1/metadata/?limit=500&offset=0&order_by=name",{
      headers: {'Mountbit-Auth':UserInfo.token()}
   }).subscribe(data => {
      this.Root = new FileItem(data);
      this.Now = Object.values(this.Root.content);
    });
  }

}
