import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'src/app/UserInfo';
import { FileManagement } from '../FileManagement';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.css']
})
export class DeleteFilesComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(private dialogRef: MatDialogRef<DeleteFilesComponent>, private http: HttpClient) { }

  ngOnInit() {




  }




  public delete()
  {

    var formdata = new FormData();
    this.selectitems.forEach((path) => formdata.append("path", path));

    this.http.post("https://api.cloudike.kr/api/1/fileops/multi/delete/",formdata, {
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe(data => {
      // 성공
    });


    
    this.dialogRef.close();
  }

}
