import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/httpservice.service';
import { FileManagement } from '../FileManagement';
import { FileItem } from '../FileItem';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  public item;

  public ischanged = false;

  public link : string;
  public date = new FormControl(this.add_time(this.delete_time(new Date()),  (1000 * 60 * 60 * 24)));
  public download_count : number;
  public download_max : number;
  public password :string;

  public setting_boolean = {};
  
  constructor(private dialogRef: MatDialogRef<ShareComponent>, private hs: HTTPService) {

  }

  private delete_time(value : Date)
  {
    return new Date(value.toDateString());
  }

  private add_time(value :Date, time : number)
  {
     return new Date(value.getTime() + time);
  }

  ngOnInit() {
    FileManagement.getItem(this.hs, FileManagement.getSelectItemPath()[0], item =>{
      this.item = item;

      if (item.public_hash == null)
        this.create();
      else
      {
        this.link = 'https://'+ UserInfo.domain + '.cloudike.kr/public/' + item.public_hash;

        this.hs.get("https://api.cloudike.kr/api/1/links/info/" + item.public_hash + '/',"링크 옵션 불러오기").subscribe
        (
          data => {
            this.getoption(data);
          }
        )
      }
    }, true);
  }


  private getoption(data)
  {
    this.ischanged = false;
    
    if (data['public_hash'] != undefined)
      this.link = 'https://'+ UserInfo.domain + '.cloudike.kr/public/' + data['public_hash'];
    
    this.download_count = data["download_count"];
    this.download_max = data["download_max"];
    if (data["password"] == true)
    {
      this.setting_boolean["password"] = true;
    }
    if (data["expires"] > 0)
    {
      this.setting_boolean["date"] = true;
      this.date.setValue(this.delete_time(new Date(data["expires"])));
      //this.date = data["expires"];
    }
    if (data["access_rights"] == "upload")
    {
      this.setting_boolean["only_upload"] = true;
    }
  }

  public create() {
    this.link = "새로운 링크를 만드는 중입니다.";
    var formdata = new FormData();
    formdata.set("path", this.item.path);

    if (this.setting_boolean["only_upload"] != null)
      formdata.set("upload_folder", this.setting_boolean["only_upload"]);

    if (this.setting_boolean["password"] == true)
      formdata.set("password", this.password);
      
    if (this.setting_boolean["date"] == true)
    {
      var ttl : number = this.date.value.getTime() - new Date().getTime();
      formdata.set("ttl", (ttl / 1000 + 60).toFixed(0));
    }

    if (this.setting_boolean["download_max"] == true)
      formdata.set("download_max", this.download_max.toString());

    this.hs.post("https://api.cloudike.kr/api/1/links/create/", formdata, "공유링크 생성").subscribe(data =>{
       this.getoption(data);
    });
  }


  public delete() : Subject<any> {
    var formdata = new FormData();
    formdata.set("path", this.item.path);

    var subject = this.hs.post("https://api.cloudike.kr/api/1/links/delete/", formdata, "공유링크 삭제");
    this.link = '링크가 삭제되었습니다.';
    return subject;
  }

  public copy(val: string) {
    // https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public apply()
  {
    this.delete().subscribe(
      data=> {
        this.create();
      }
    )
  }
}
