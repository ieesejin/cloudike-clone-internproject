import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserInfo } from 'src/app/UserInfo';
import { FileManagement } from '../FileManagement';
import { HTTPService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.css']
})
export class DeleteFilesComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(private dialogRef: MatDialogRef<DeleteFilesComponent>, private hs: HTTPService) { }

  ngOnInit() {

  }




  public delete()
  {
    var formdata = new FormData();
    this.selectitems.forEach((path) => formdata.append("path", path));

    this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/",formdata,this.selectitems.length + "개의 파일 삭제").subscribe(data => {
      // 성공
    });
    
    this.dialogRef.close();
  }

}
