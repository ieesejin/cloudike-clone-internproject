import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { FileItem } from './FileItem';
import { ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { FileManagement } from './FileManagement';
import { HttpClientUploadService, FileItem as FileItemUpload} from '@wkoza/ngx-upload/src';

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
  public selectedValue = [];

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
  private change(e, type){
    if(!e.checked){
      this.selectedValue.push(type);
    }
    else{
      let updateItem = this.selectedValue.find(this.findIndexToUpdate, type.FileItem)
      let index = this.selectedValue.indexOf(updateItem);
    }
    
    console.log(this.selectedValue);
  }
  findIndexToUpdate(type){
    return type.FileItem === this;
  }
}
