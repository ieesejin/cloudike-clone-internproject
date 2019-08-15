import { Component, OnInit, QueryList, ViewChild, ViewChildren, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { CdkDragDrop, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { MatDialog } from '@angular/material';
import { NewFolderComponent } from './dialog/new-folder/new-folder.component';
import { DeleteFilesComponent } from './dialog/delete-files/delete-files.component';
import { MoveFileComponent } from './dialog/move-file/move-file.component';
import { HTTPService } from '../service/HttpService/httpservice.service';
import { ShareComponent } from './dialog/share/share.component';
import { RenameComponent } from './dialog/rename/rename.component';
import { SelectContainerComponent, SelectItemDirective } from 'ngx-drag-to-select/projects/ngx-drag-to-select/src/public_api';
import { ValueStorageService } from '../service/ValueStorage/value-storage.service';
import { ToastrService } from 'ngx-toastr';
import { MainLayoutComponent } from '../main-layout/main-layout.component';
import { CloudikeApiService } from '../service/CloudikeAPI/cloudike-api.service';



@Component({
  selector: 'app-drive',
  templateUrl: './drive.component.html',
  styleUrls: ['./drive.component.css']
})

export class DriveComponent implements OnInit {

  @ViewChild('basicMenu', { static: true }) public basicMenu: ContextMenuComponent;

  @ViewChild(SelectContainerComponent, { static: true }) selectContainer: SelectContainerComponent;
  @ViewChildren(SelectItemDirective) SelectItemDirectives: QueryList<SelectItemDirective>;

  public static Now: FileItem = new FileItem(null);

  public dragSelectItems: string[] = [];

  public changing_old_name: string = null;

  public mode = "";

  get nowfile(): FileItem {
    if (this.mode == "favorites")
    {
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
    return DriveComponent.Now;
  }

  public keepOriginalOrder = (a, b) => a.key;
  public ParentFolder = [];

  constructor(private router: Router, public dialog: MatDialog, private hs: HTTPService, private valueStorage: ValueStorageService, private toastr: ToastrService, private api: CloudikeApiService) {
    router.events.subscribe((event) => {

      if (event instanceof NavigationEnd) {
        // Show loading indicator
        this.Update();
      }
    });

    MainLayoutComponent.UpdatePosition.subscribe(() => {
      this.selectContainer.update();
    });
  }

  ngOnInit() {
    this.Update();
  }

  private Update() {
    if (this.router.url.indexOf("/trash") == 0) this.mode = "trash";
    if (this.router.url.indexOf("/drive") == 0) this.mode = "drive";
    if (this.router.url.indexOf("/favorites") == 0) this.mode = "favorites";

    if (this.mode == "trash") {

      this.hs.get("https://api.cloudike.kr/api/1/trash/?limit=500&offset=0&order_by=name", "휴지통 불러오기").subscribe(data => {
        // 성공한경우 해당 파일을 만들고 캐시에 저장
        DriveComponent.Now = new FileItem(data);
        this.ParentFolder = [{ name: "휴지통", path: "/trash" }];
      }
      )
    }
    else if (this.mode == "favorites")
    {
     // DriveComponent.Now = new FileItem("favorites");
    }
    if (this.mode != "drive") return;
    let url = decodeURI(this.router.url.substring("/drive".length));

    FileManagement.getItem(this.hs, url, (item) => {
      DriveComponent.Now = item;
      this.ParentFolder = FileItem.SplitPath(item.path);
    });

    var selectAllChkbox = <HTMLInputElement>document.getElementById("selectAllChkbox");
    if (selectAllChkbox.checked) {
      selectAllChkbox.checked = false;
    }
  }

  private AllCheckBoxUpdate() {
    // 목록에 하나라도 있으면
    if (this.nowfile.length != 0) {
      // 전체 체크박스 체크
      var selectAllChkbox = <HTMLInputElement>document.getElementById("selectAllChkbox");
      selectAllChkbox.checked = this.selectItem.length == this.nowfile.length;
    }
  }
  public onDragSelect(event) {
    // 체크박스 리스트 다시 작성
    var element = document.getElementsByName("chk_info");
    element.forEach((inputbox: HTMLInputElement) => {
      inputbox.checked = this.dragSelectItems.includes(inputbox.value);
    });

    // 드래그 리스트 다시 작성
    this.SelectItemDirectives.forEach(tabInstance => {
      tabInstance.selected = this.dragSelectItems.includes(tabInstance.dtsSelectItem);
    });

    this.AllCheckBoxUpdate();

  }

  // 전체선택 및 전체해제
  private selectAll(value) {
    var list = document.getElementsByName("chk_info");
    list.forEach((element: HTMLInputElement) => {
      element.checked = value;
    });

    var selectAllChkbox = <HTMLInputElement>document.getElementById("selectAllChkbox");
    selectAllChkbox.checked = value;

    if (value == true)
      this.selectContainer.selectAll();
    else
      this.selectContainer.clearSelection();
  }

  // 각각의 체크박스를 다룰 때 
  private onCheckboxChange(item: FileItem, event) {

    // 체크한 목록을 드래그 상태에 포함
    this.SelectItemDirectives.forEach(dragitem => {
      if (dragitem.dtsSelectItem == item.path)
        dragitem.selected = event.target.checked;
    });

    this.AllCheckBoxUpdate();
  }

  private getItemValue(list: CdkDropList, index: number) {
    return list.element.nativeElement.children[index].children[0].children[0].children[0].getAttribute("value");
  }


  drag(event: CdkDragDrop<string[]>) {
    var draggable = event.container.element.nativeElement.children[event.currentIndex].children[0].children[1] != null;

    if (draggable == true && this.getItemValue(event.container, event.currentIndex) == event.item.data) draggable = false;
    var item = document.getElementsByClassName("dragitem")[0].classList;

    if (draggable) {
      if (!item.contains("on"))
        item.add("on");
    }
    else {
      if (item.contains("on"))
        item.remove("on");
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    var old_path = this.getItemValue(event.container, event.previousIndex);
    var new_path = this.getItemValue(event.container, event.currentIndex);

    this.api.Move(old_path, new_path);
  }
  public isOneSelect = (item: FileItem): boolean => {
    return !this.selectItem.includes(item.path) || this.selectItem.length <= 1;
  }

  public get selectItem() {
    return FileManagement.getSelectItemPath();
  }

  public new_folder() {
    this.dialog.open(NewFolderComponent);
  }
  public delete_file() {
    this.dialog.open(DeleteFilesComponent);
  }
  public move_file() {
    this.dialog.open(MoveFileComponent);
  }
  public rename_file() {
    this.dialog.open(RenameComponent);
  }
  public share_file(item) {
    if (item != null) {
      this.selectAll(false);
      this.CheckingItem(item);
    }
    this.dialog.open(ShareComponent);
  }
  public create(name: string) {
    this.api.CreateFolder(this.api.GetURLPath(), name).subscribe(data => {

      this.changing_old_name = name;

      setTimeout(() => {
        var change_name_box: HTMLInputElement = <HTMLInputElement>document.getElementById("namebox");
        change_name_box.focus();

        change_name_box.setSelectionRange(0, name.length);

      }, 50);
    });
  }
  public go_parent_folder() {
    if (this.ParentFolder.length == 1) {
      this.toastr.info('상위 폴더가 없습니다.');
      return
    }
    else {
      var last_parent = this.ParentFolder[this.ParentFolder.length - 2];
      this.router.navigate(['/drive' + last_parent.path]);
    }
  }

  public save_name(event, item: FileItem) {
    this.changing_old_name = null;
    if (item.name != event.target.value) {
      this.api.Rename(item, event.target.value);
    }
  }
  public timer = null;
  public last_click = new Date();
  public ItemDoubleClick(item: FileItem) {
    if (item.isfolder)
      this.router.navigate(['/drive' + item.path]);
    else
      item.Download(this.hs);
  }
  public ItemClick(event, item: FileItem) {
    // 해당 아이템이 선택되있지 않으면
    var element = <HTMLInputElement>document.getElementById("chkbox" + item.name);

    // 컨트롤 키는 별도로 생각
    if (event.ctrlKey) {
      element.checked = !element.checked;
      // 이를 기준으로 드래그 리스트 목록 다시 작성
      this.SelectItemDirectives.forEach(tabInstance => {
        if (tabInstance.dtsSelectItem == item.path)
          tabInstance.selected = element.checked;
      });

      this.AllCheckBoxUpdate();
      return;
    }
    var delay = new Date().getTime() - this.last_click.getTime();
    this.last_click = new Date();

    if (this.timer != null) {
      clearTimeout(this.timer);
    }
    if (element.checked) {
      if (delay < 500) {
        this.ItemDoubleClick(item);
      }
      else {
        this.timer = setTimeout(() => {
          this.timer = null;
          this.changing_old_name = item.name;
          setTimeout(() => {
            var change_name_box: HTMLInputElement = <HTMLInputElement>document.getElementById("namebox");
            change_name_box.focus();
            if (item.isfolder) {
              change_name_box.setSelectionRange(0, item.name.length);
            }
            else {
              if (item.name.indexOf('.') < 0) {
                change_name_box.setSelectionRange(0, item.name.length);
              }
              else {
                change_name_box.setSelectionRange(0, item.name.lastIndexOf('.'));
              }
            }
          }, 50);
        }, 500);
      }
    }


    // 모든 아이템의 선택을 해제
    var allelement = document.getElementsByName("chk_info");
    allelement.forEach((element2: HTMLInputElement) => {
      element2.checked = false;
    });

    // 해당 아이템만 선택
    element.checked = true;

    // 이를 기준으로 드래그 리스트 목록 다시 작성
    this.SelectItemDirectives.forEach(tabInstance => {
      tabInstance.selected = tabInstance.dtsSelectItem == item.path;
    });
  }
  public reset(event: MouseEvent) {
    if (!event.ctrlKey && !event.shiftKey) {
      // 모든 아이템의 선택을 해제
      var allelement = document.getElementsByName("chk_info");
      allelement.forEach((element2: HTMLInputElement) => {
        element2.checked = false;
      });


      // 이를 기준으로 드래그 리스트 목록 다시 작성
      this.SelectItemDirectives.forEach(tabInstance => {
        tabInstance.selected = false;
      });

      this.AllCheckBoxUpdate();
    }
  }
  public CheckingItem(item) {
    // 해당 아이템이 선택되있지 않으면
    var element = <HTMLInputElement>document.getElementById("chkbox" + item.name);
    if (element.checked == false) {
      // 모든 아이템의 선택을 해제
      var allelement = document.getElementsByName("chk_info");
      allelement.forEach((element2: HTMLInputElement) => {
        element2.checked = false;
      });

      // 해당 아이템만 선택
      element.checked = true;

      // 이를 기준으로 드래그 리스트 목록 다시 작성
      this.SelectItemDirectives.forEach(tabInstance => {
        tabInstance.selected = tabInstance.dtsSelectItem == item.path;
      });

      this.AllCheckBoxUpdate();
    }
  }
}