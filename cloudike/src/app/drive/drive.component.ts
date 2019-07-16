import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { HttpClientUploadService, FileItem as FileItemUpload} from '@wkoza/ngx-upload/src';
import { del } from 'selenium-webdriver/http';
import { isNgTemplate } from '@angular/compiler';
import { Key } from 'protractor';

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

  constructor(private http:HttpClient, private router : Router, public uploader: HttpClientUploadService) { 
    router.events.subscribe( (event) => {

      if (event instanceof NavigationEnd) {
          // Show loading indicator
          this.Update();
      }
  });
  }

  ngOnInit() {
    this.Update();


    this.uploader.onCancel$.subscribe(
      (data: FileItemUpload) => {
          console.log('file deleted: ' + data.file);

      });

    this.uploader.onProgress$.subscribe(
        (data: any) => {
            console.log('upload file in progree: ' + data.progress);

        });

    this.uploader.onSuccess$.subscribe(
        (data: any) => {
            console.log(`upload file successful:  ${data.item} ${data.body} ${data.status} ${data.headers}`);

            var fileitem : FileItemUpload = data.item;


        }
    );
    this.uploader.onAddToQueue$.subscribe(
      (data:FileItemUpload)=>
      {
        var path = this.ParantFolder[this.ParantFolder.length - 1].path;
        if (path[path.length - 1] != '/')
          path = path + '/';
        path += data.filePath;

        var formdata = new FormData();
        formdata.set("size",data.file.size.toString());
        formdata.set("path", path);
        formdata.set("overwrite", "1");
        formdata.set("multipart", "false");
        var folder = 
        this.http.post("https://api.cloudike.kr/api/1/files/create/",formdata, {
          headers: {'Mountbit-Auth':UserInfo.token}
        }).subscribe(create_data => {
          var confirm_url = create_data["confirm_url"];
          var url = create_data["url"];
          var method = create_data["method"];

          data.disableMultipart = true;
          data.alias = confirm_url;
          data.onSuccess$.subscribe(()=>{
            this.http.post(data.alias, {}).subscribe(create_data => {
              console.log("최종 완료" + data.file.name);
            });

          });
          data.upload({method: method, url: url});


        });


          console.log("데이터 입력");
      }
    )



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
}