import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material'
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/httpservice.service';
import { FileManagement } from '../FileManagement';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  public selectitem = FileManagement.getSelectItemPath()[0];
  public link : string;

  constructor(private dialogRef: MatDialogRef<ShareComponent>, private hs: HTTPService) {

  }

  ngOnInit() {
    this.link = "링크를 불러오는 중입니다";
    this.create();
  }

  public create() {
    var formdata = new FormData();
    formdata.set("path", this.selectitem);

    this.hs.post("https://api.cloudike.kr/api/1/links/create/", formdata, "공유링크 생성").subscribe(response =>{
      // It can return the value 'public_hash' in this.link
      this.link = 'https://'+ UserInfo.domain + '.cloudike.kr/public/' + response['public_hash'];
    });
  }


  public delete() {
    var formdata = new FormData();
    formdata.set("path", this.selectitem);

    this.hs.post("https://api.cloudike.kr/api/1/links/delete/", formdata, "공유링크 삭제");

    this.link = '링크가 삭제되었습니다.';

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
}
