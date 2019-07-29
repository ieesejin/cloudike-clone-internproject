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
import { HTTPService } from '../httpservice.service';


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

  constructor(private router : Router, public dialog: MatDialog, private hs : HTTPService) { 
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

    FileManagement.getItem(this.hs, url,(item)=>{
      DriveComponent.Now = item;
      this.ParantFolder = FileItem.SplitPath(item.path);
    });
    
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
      this.hs.post("https://api.cloudike.kr/api/1/files/create_link_of_archive/",formdata, item.name + " 압축 다운로드").subscribe(data => {
          window.location.replace("https://api.cloudike.kr/api/1/files/download_as_archive_stream/" + data["hash"] + "/");
      });

    }
    else
    {
      // 파일 다운로드
      this.hs.get("https://api.cloudike.kr/api/1/files/get" + item.path, item.name + " 다운로드").subscribe(data => {
        window.location = data["url"];
      });
    }
  }

  //전체선택 및 전체해제
  private selectAll(event){
    var result = [];
    var list= document.getElementsByName("chk_info");
    list.forEach((element : HTMLInputElement) => {
      element.checked = event.target.checked;
    });
    return result;
    
  }

  //각각의 체크박스를 다룰 때 
  private onCheckboxChange(item: FileItem, event) {
    var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
    //체크했을 때
    if(event.target.checked) {
      if (FileManagement.getSelectItemPath().length == Object.keys(this.nowfile.content).length)
        selectAllChkbox.checked = true;
    }
    //체크를 풀었을 때
    else {
        selectAllChkbox.checked = false;
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
    this.hs.post("https://api.cloudike.kr/api/1/fileops/move/", formdata, "파일 이동").subscribe(data => {
      console.log("성공");
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
}