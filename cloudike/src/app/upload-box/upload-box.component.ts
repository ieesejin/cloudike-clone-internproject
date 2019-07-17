import { Component, OnInit } from '@angular/core';
import { HttpClientUploadService, FileItem as FileItemUpload, FileItem} from '@wkoza/ngx-upload/src';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-box',
  templateUrl: './upload-box.component.html',
  styleUrls: ['./upload-box.component.css']
})

const max_simultaneously_uploading = 2;
export class UploadBoxComponent implements OnInit {
  upload_queue_count = 0;
  minimization = false;
  uploading_item : FileItemUpload[] = [];
  constructor(private http:HttpClient, private router : Router, public uploader: HttpClientUploadService) { }

  public clean()
  {
    var temp : FileItemUpload[] = [];
    for (const item of this.uploader.queue) {
      temp.push(item);
    }
    temp.forEach(item => {
      
      // 실제 업로드중인 경우를 처리하기 위해 캔슬 명령어 입력
      item.cancel();
      // 업로드중이 아닌 경우도 캔슬로 처리
      item.ɵonCancel();
      // 큐에서 삭제
      this.uploader.removeFromQueue(item);
    });
    this.upload_queue_count = 0;
  }

  public NextUpload()
  {
    var new_array = []
    this.uploading_item.forEach(element => {
      if (element.isSuccess != true)
      {
        new_array.push(element);
      }
    });
    this.uploading_item = new_array;

    this.uploader.queue.forEach(item => {
      if (item.isReady && this.uploading_item.length < max_simultaneously_uploading && !this.uploading_item.includes(item))
      {
        this.uploading_item.push(item);

        var path = decodeURI(this.router.url.substring("/drive".length));
        if (path[path.length - 1] != '/')
          path = path + '/';
        path += item.filePath;

        var formdata = new FormData();
        formdata.set("size", item.file.size.toString());
        formdata.set("path", path);
        formdata.set("overwrite", "1");
        formdata.set("multipart", "false");

        this.http.post("https://api.cloudike.kr/api/1/files/create/",formdata, {
          headers: {'Mountbit-Auth':UserInfo.token}
        }).subscribe(create_data => {
          var confirm_url = create_data["confirm_url"];
          var url = create_data["url"];
          var method = create_data["method"];

          item.disableMultipart = true;
          item.onSuccess$.subscribe(()=>{
            this.http.post(confirm_url, {}).subscribe(create_data => {
              console.log("최종 완료" + item.file.name);
              if (this.upload_queue_count < this.uploader.queue.length)
                this.upload_queue_count += 1;
              this.NextUpload();
            });
    
          });

          if (item.isCancel != true)
          {
            item.upload({method: method, url: url});
          }
        });
      }
    });





  }
  ngOnInit() {
    
    this.uploader.onCancel$.subscribe(
      (data: FileItemUpload) => {
          console.log('file deleted: ' + data.file);

      });

    this.uploader.onProgress$.subscribe(
        (data: any) => {
            console.log(data.item.file.name + 'upload file in progree: ' + data.progress);

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
        this.NextUpload();
      }
    )

  }

}
