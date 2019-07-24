import { Component, OnInit, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { CdkDragDrop, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { ConsoleLogger } from '@wkoza/ngx-upload/src/utils/logger.model';

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
    if (this.router.url.indexOf("/drive") != 0) return;
    let url = decodeURI(this.router.url.substring("/drive".length));

    FileManagement.getItem(this.http, url,(item)=>{
      DriveComponent.Now = item;
      this.ParantFolder = FileItem.SplitPath(item.path);
    });
    
    this.checkedList = [];
    var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
    if(selectAllChkbox.checked){
      selectAllChkbox.checked = false;
    }
  }
  private Download(item: FileItem)
  {
    this.http.get("https://api.cloudike.kr/api/1/files/get" + item.path,{
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe(data => {
      window.location = data["url"];
    });
  }

  //전체선택 및 전체해제
  private selectAll(event){
    //전체선택
    if(event.target.checked){
      this.checkedList = [];
      //파일과 폴더 총 수 만큼 for문
      for(var i=0; i<Object.keys(this.nowfile.content).length; i++){
        //모든 체크박스를 checked로 바꿈
        var chkbox = <HTMLInputElement> document.getElementById("chkbox" + i);
        if(!chkbox.checked){
          chkbox.checked = true;
        }
      }
      //모든 item 을 key, value 형태로 넣어줌
      Object.keys(this.nowfile.content).forEach(item_key => {
        this.checkedList.push({key:item_key, value:this.nowfile.content[item_key]});
      });
      console.log(this.checkedList);
    }
    //전체해제
    else{
      this.checkedList = []; //다 비움
      //모든 체크박스를 해제
      for(var i=0; i<Object.keys(this.nowfile.content).length; i++){
        var chkbox = <HTMLInputElement> document.getElementById("chkbox" + i);
        if(chkbox.checked){
          chkbox.checked = false;
        }
      }
      console.log(this.checkedList);
    }
  }

  //각각의 체크박스를 다룰 때 
  private onCheckboxChange(item: FileItem, event) {
    //체크했을 때
    if(event.target.checked) {
      //체크했을 때 모든 체크박스가 다 체크된 경우
      if(this.checkedList.length+1 == Object.keys(this.nowfile.content).length){
        var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
        selectAllChkbox.checked = true;
        this.checkedList.push(item);
        console.log(this.checkedList);
      }
      else{
        this.checkedList.push(item);
        console.log(this.checkedList);
      }
    }
    //체크를 풀었을 때
    else {
      var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
      //전체선택이 아닌 경우
      if(!selectAllChkbox.checked){
        var index = this.checkedList.map((o) => o.attr1).indexOf(item.name);
        if (index > -1) {
          this.checkedList.splice(index, 1);
        }
        console.log(this.checkedList);
      }
      //전체선택 되어있을 때 풀었을 때
      else{
        var index = this.checkedList.map((o) => o.attr1).indexOf(item.name);
        if (index > -1) {
          this.checkedList.splice(index, 1);
        }
        selectAllChkbox.checked = false;
        console.log(this.checkedList);
      }
    }
  }

  private getItemValue(list: CdkDropList, index: number)
  {
    return list.element.nativeElement.children[index].children[0].children[0].getAttribute("value");
  }


  drag(event: CdkDragDrop<string[]>) {
    var draggable = event.container.element.nativeElement.children[event.currentIndex].children[0].children[1] != null;

    if (draggable == true && this.getItemValue(event.container,event.currentIndex) == event.item.data) draggable = false;
    var item = document.getElementsByClassName("dragitem")[0].classList;

    if (draggable) 
    {
      if (!item.contains("on"))
        item.add("on");
    }
    else
    {
      if (item.contains("on"))
        item.remove("on");
    }
  }
  
  drop(event: CdkDragDrop<string[]>) {
    var old_path = this.getItemValue(event.container,event.previousIndex);
    var new_path = this.getItemValue(event.container,event.currentIndex);
    var formdata = new FormData();
    formdata.set("from_path",old_path);
    formdata.set("to_path",new_path);
    this.http.post("https://api.cloudike.kr/api/1/fileops/move/", formdata, {
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe(data => {
      // 성공
    });
  }

  
}