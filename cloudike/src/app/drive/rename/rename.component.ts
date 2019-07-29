import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/UserInfo';
import { FileManagement } from '../FileManagement';
import { HTTPService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.css']
})
export class RenameComponent implements OnInit {

  inputName: string = "";
  public selectitems = FileManagement.getSelectItemPath();
  constructor(private dialogRef: MatDialogRef<RenameComponent>, private router: Router, private hs: HTTPService) { }

  ngOnInit() {
  }

  public rename(name : string)
  {
    this.selectitems.forEach(element => {
      var formdata = new FormData();
      formdata.set("path", element);
      formdata.set("newname", name);

      console.log(element);
      console.log(name);
      this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/", formdata, element + " 이름 변경").subscribe(data => {
        // 성공
      });
  });
    this.dialogRef.close();
  }
}
