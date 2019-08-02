import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { ShareComponent } from './share/share.component';
import { RenameComponent } from './rename/rename.component';
import { SelectContainerComponent, SelectItemDirective } from 'ngx-drag-to-select';


@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})

export class DriveComponent implements OnInit {

  @ViewChild('basicMenu', {static : true}) public basicMenu: ContextMenuComponent;
  @ViewChild(SelectContainerComponent, {static : true}) selectContainer: SelectContainerComponent;
  @ViewChildren(SelectItemDirective) SelectItemDirectives: QueryList<SelectItemDirective>;

  
  public static Root :FileItem = new FileItem(null);
  public static Now :FileItem = new FileItem(null);
  
  public dragSelectItems : string[] = [];

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

  public onDragSelect(event)
  {
    // 체크박스 리스트 다시 작성
    var element = document.getElementsByName("chk_info");
    element.forEach((inputbox : HTMLInputElement) => {
      inputbox.checked = this.dragSelectItems.includes(inputbox.value);
    });
    
    // 드래그 리스트 다시 작성
    this.SelectItemDirectives.forEach(tabInstance =>
      {
        tabInstance.selected = this.dragSelectItems.includes(tabInstance.dtsSelectItem);
    });

    // 목록에 하나라도 있으면
    if (this.nowfile.length != 0)
    {
      // 전체 체크박스 체크
      var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
      selectAllChkbox.checked = this.dragSelectItems.length == this.nowfile.length;
    }

  }
  //전체선택 및 전체해제
  private selectAll(value){
    var result = [];
    var list= document.getElementsByName("chk_info");
    list.forEach((element : HTMLInputElement) => {
      element.checked = value;
    });
    
    var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
    selectAllChkbox.checked = value;

    if (value == true)
    {
      this.selectContainer.selectAll();
    } else {
      this.selectContainer.clearSelection();
    }
    return result;
    
  }

  //각각의 체크박스를 다룰 때 
  private onCheckboxChange(item: FileItem, event) {
    // 전체 체크박스 체크
    var selectAllChkbox = <HTMLInputElement> document.getElementById("selectAllChkbox");
    selectAllChkbox.checked = FileManagement.getSelectItemPath().length == this.nowfile.length;

    // 체크한 목록을 드래그 상태에 포함
    this.SelectItemDirectives.forEach(dragitem =>
    {
      if (dragitem.dtsSelectItem == item.path)
        dragitem.selected = event.target.checked;
    });
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
  public isOneSelect = (item : FileItem) :  boolean  => {
    return !this.selectItem.includes(item.path) ||  this.selectItem.length <= 1;
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
  public rename_file()
  {
    this.dialog.open(RenameComponent);
  }
  public share_file(item)
  {
    if (item != null)
    {   
      this.selectAll(false);
      this.CheckingItem(item);
    }
    this.dialog.open(ShareComponent);
  }

  public CheckingItem(item)
  {
    // 해당 아이템이 선택되있지 않으면
    var element = <HTMLInputElement>document.getElementById("chkbox" + item.name);
    if(element.checked == false)
    {
      // 모든 아이템의 선택을 해제
      var allelement = document.getElementsByName("chk_info");
      allelement.forEach((element2 : HTMLInputElement) => {
        element2.checked = false;
      });

      // 해당 아이템만 선택
      element.checked = true;

      // 이를 기준으로 드래그 리스트 목록 다시 작성
      this.SelectItemDirectives.forEach(tabInstance =>
        {
          tabInstance.selected = tabInstance.dtsSelectItem == item.path;
        });
    }
  }
}