import { Component, OnInit } from '@angular/core';
import { FileManagement } from '../FileManagement';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'src/app/UserInfo';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {

  public path : string = null;
  public selectitems = FileManagement.getSelectItemPath();
  constructor(private dialogRef: MatDialogRef<MoveFileComponent>, public http: HttpClient) {
  }

  ngOnInit() {
  }

  public change_path = (url: string) =>
  {
    console.log(this);
    this.path = url;
  }
  private api(url)
  {
    this.selectitems.forEach(element => {
        var formdata = new FormData();
        formdata.set("from_path",element);
        formdata.set("to_path",this.path);
        this.http.post(url, formdata, {
          headers: {'Mountbit-Auth':UserInfo.token}
        }).subscribe(data => {
          // 성공
        });
    });
  }
  public move()
  {
    this.api("https://api.cloudike.kr/api/1/fileops/move/");
    this.dialogRef.close();
  }

  public copy()
  {
    this.api("https://api.cloudike.kr/api/1/fileops/copy/");
    this.dialogRef.close();
  }

}
