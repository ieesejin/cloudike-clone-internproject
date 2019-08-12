import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/httpservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

  inputName: string = "";
  constructor(private dialogRef: MatDialogRef<NewFolderComponent>, private router: Router, private hs: HTTPService, private toastr: ToastrService) { }

  ngOnInit() {
  }

  public create(name: string) {
    var formdata = new FormData();
    var url = decodeURI(this.router.url).substring("/drive".length);

    if (url == "" || url[0] != '/') url = '/' + url;
    if (url[url.length - 1] != '/') url = url + '/';

    formdata.append("path", url + name);
    //console.log(formdata.get("path"));
    this.hs.post("https://api.cloudike.kr/api/1/fileops/folder_create/", formdata, url + name + " 폴더 생성").subscribe(data => {
      this.toastr.success('폴더가 생성되었습니다.')
      // 성공
    }, error => {
      if (error.error["code"] == 'FolderAlreadyCreated') {
        this.toastr.error('같은 이름이 존재합니다.')
      }
      else {
        this.toastr.error('에러가 발생하였습니다.')
      }
    });
    this.dialogRef.close();
  }
}
