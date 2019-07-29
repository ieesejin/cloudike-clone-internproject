import { Component, OnInit } from '@angular/core';
import { FileManagement } from '../FileManagement';
import { UserInfo } from 'src/app/UserInfo';
import { MatDialogRef } from '@angular/material';
import { HTTPService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {

  public path : string = null;
  public selectitems = FileManagement.getSelectItemPath();
  constructor(private dialogRef: MatDialogRef<MoveFileComponent>, public hs: HTTPService) {
  }

  ngOnInit() {
  }

  public change_path = (url: string) =>
  {
    console.log(this);
    this.path = url;
  }
  
  private api(url, message)
  {
    this.selectitems.forEach(element => {
        var formdata = new FormData();
        formdata.set("from_path",element);
        formdata.set("to_path",this.path);
        this.hs.post(url, formdata, element + " "+ message).subscribe(data => {
          // 성공
        });
    });
  }
  public move()
  {
    this.api("https://api.cloudike.kr/api/1/fileops/move/", "파일 이동");
    this.dialogRef.close();
  }

  public copy()
  {
    this.api("https://api.cloudike.kr/api/1/fileops/copy/", "파일 복사");
    this.dialogRef.close();
  }

}
