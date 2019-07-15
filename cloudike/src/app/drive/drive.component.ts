import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { del } from 'selenium-webdriver/http';
import { isNgTemplate } from '@angular/compiler';


@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DriveComponent implements OnInit {

  public static Root :FileItem = new FileItem(null);
  public static Now :FileItem = new FileItem(null);
  
  
  get nowfile():FileItem {
    return DriveComponent.Now;
  }

  public keepOriginalOrder = (a, b) => a.key;
  public ParantFolder = [];
  public checkedList = [];

  constructor(private http:HttpClient, private router : Router) { 
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
    let url = decodeURI(this.router.url.substring("/drive".length));

    FileManagement.getItem(this.http, url,(item)=>{
      DriveComponent.Now = item;
      this.ParantFolder = FileItem.SplitPath(item.path);
    });
  }
  private Download(item: FileItem)
  {
    this.http.get("https://api.cloudike.kr/api/1/files/get" + item.path,{
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe(data => {
      window.location = data["url"];
    });
  }

  private selectAll(event){
    if(event.target.checked){
      this.checkedList = [];
      for(var i=0; i<Object.keys(this.nowfile.content).length; i++){
        var chkbox = <HTMLInputElement> document.getElementById("chkbox" + i);
        if(!chkbox.checked){
          chkbox.checked = true;
        }
      }
      Object.keys(this.nowfile.content).forEach(item_key => {
        this.checkedList.push({key:item_key, value:this.nowfile.content[item_key]});
      });
      console.log(this.checkedList);
    }
    else{
      this.checkedList = [];
      for(var i=0; i<Object.keys(this.nowfile.content).length; i++){
        var chkbox = <HTMLInputElement> document.getElementById("chkbox" + i);
        if(chkbox.checked){
          chkbox.checked = false;
        }
      }
      console.log(this.checkedList);
    }
  }

  private onCheckboxChange(item: FileItem, event) {
    if(event.target.checked) {
      this.checkedList.push(item);
    } 
    else {
      const index = this.checkedList.indexOf(item, 0);
      if (index > -1) {
        this.checkedList.splice(index, 1);
      }
    }
    console.log(this.checkedList);
  }
}
