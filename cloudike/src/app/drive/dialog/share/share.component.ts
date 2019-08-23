import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { FileManagement } from '../../FileManagement';
import { FileItem } from '../../FileItem';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CloudikeApiService, CloudLinkOption } from 'src/app/service/CloudikeAPI/cloudike-api.service';
import { CloudikeApiResult } from 'src/app/service/CloudikeAPI/cloudike-api.result';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  public item: FileItem;

  public ischanged = false;

  public link: string;
  public date = new FormControl(this.add_time(this.delete_time(new Date()), (1000 * 60 * 60 * 24)));
  public download_count: number;
  public download_max: number;
  public password: string;

  public setting_boolean = {};

  constructor(public dialogRef: MatDialogRef<ShareComponent>, private hs: HTTPService, private api: CloudikeApiService) {

  }

  private delete_time(value: Date) {
    return new Date(value.toDateString());
  }

  private add_time(value: Date, time: number) {
    return new Date(value.getTime() + time);
  }

  ngOnInit() {
    FileManagement.getItem(this.hs, FileManagement.getSelectItemPath()[0], item => {
      this.item = item;

      if (item.public_hash == null)
        this.create();
      else
        this.api.GetSharedLinkOption(this.item).subscribe((data) => {
          this.link = 'https://' + UserInfo.domain + '.cloudike.kr/public/' + item.public_hash;
          this.getoption(data);
        });

    }, true);
  }


  private getoption(data) {
    this.ischanged = false;

    if (data['public_hash'] != undefined)
      this.link = 'https://' + UserInfo.domain + '.cloudike.kr/public/' + data['public_hash'];

    this.download_count = data["download_count"];
    this.download_max = data["download_max"];
    if (this.download_max != 0) {
      this.setting_boolean["download_max"] = true;
    }
    if (data["password"] == true) {
      this.setting_boolean["password"] = true;
    }
    if (data["expires"] > 0) {
      this.setting_boolean["date"] = true;
      this.date.setValue(this.delete_time(new Date(data["expires"])));
      //this.date = data["expires"];
    }
    if (data["access_rights"] == "upload") {
      this.setting_boolean["only_upload"] = true;
    }
  }

  private setoption(): CloudLinkOption {
    return {
      only_upload: this.setting_boolean["only_upload"] == true ? true : null,
      date: this.setting_boolean["date"] == true ? this.date.value : null,
      password: this.setting_boolean["password"] == true ? this.password : null,
      download_max: this.setting_boolean["download_max"] == true ? this.download_max : null
    };
  }

  public create() {
    this.link = "새로운 링크를 만드는 중입니다.";
    this.api.CreateSharedLink(this.item, this.setoption()).subscribe(data => this.getoption(data));
  }

  public delete() {
    this.api.RemoveSharedLink(this.item).subscribe(
      () => this.link = '링크가 삭제되었습니다.'
    );
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

  public apply() {
    this.api.ChangeSharedLinkOption(this.item, this.setoption()).subscribe(
      data => this.getoption(data),
      error => this.link = '링크가 삭제되었습니다.'
    );
  }
}
