import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { CdkDragDrop, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog } from '@angular/material';
import { NewFolderComponent } from './new-folder/new-folder.component';
import { DeleteFilesComponent } from './delete-files/delete-files.component';
import { MoveFileComponent } from './move-file/move-file.component';


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

  constructor(private http:HttpClient, private router : Router, public dialog: MatDialog) { 
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
  public Download(item: FileItem)
  {
    if (item.isfolder)
    {
      var formdata = new FormData();
      formdata.set("path", item.path);
      formdata.set("is_win", "true");
      // 폴더 다운로드
      this.http.post("https://api.cloudike.kr/api/1/files/create_link_of_archive/",formdata, {
        headers: {'Mountbit-Auth':UserInfo.token}
      }).subscribe(data => {
          window.location.replace("https://api.cloudike.kr/api/1/files/download_as_archive_stream/" + data["hash"] + "/");
      });

    }
    else
    {
      // 파일 다운로드
      this.http.get("https://api.cloudike.kr/api/1/files/get" + item.path,{
        headers: {'Mountbit-Auth':UserInfo.token}
      }).subscribe(data => {
        window.location = data["url"];
      });
    }
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
    return list.element.nativeElement.children[index].children[0].children[0].children[0].getAttribute("value");
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

  

  @ViewChild('basicMenu', {static : true}) public basicMenu: ContextMenuComponent;
  @ViewChild('otherMenu', {static : true}) public otherMenu: ContextMenuComponent;

  public menuSelect(item){
    if(item.type == 'Word'){
      return this.otherMenu;
    }
    else {
      return this.basicMenu;
    }

  }

  public get selectItem()
  {
    return FileManagement.getSelectItemPath();
  }

  public new_folder()
  {
    this.dialog.open(NewFolderComponent);
  }
  public delete_file()
  {
    this.dialog.open(DeleteFilesComponent);
  }
  public move_file()
  {
    this.dialog.open(MoveFileComponent);
  }

  public getRightClickItem(item)
  {
      var list = document.getElementsByName("chk_info");
      list.forEach((element : HTMLInputElement) => {
        if(element.value == item.path) {
          if(element.checked){
            return
          }
          else{
            for(var i=0; i<Object.keys(this.nowfile.content).length; i++){
              var chkbox = <HTMLInputElement> document.getElementById("chkbox" + i);
              if(chkbox.checked){
                chkbox.checked = false;
              }
            }
            element.checked = true;
            return
          }
        }
      });
  }

  public getThumbnails(item : FileItem){
    var smallThumbnails : string;

    if(item.extraData['thumbnails'] != null){
      if(item.extraData['thumbnails']['status'] == 'ready'){
        smallThumbnails = item.extraData['thumbnails']['small']['link'];
      }
    }
    return smallThumbnails;
  }

}