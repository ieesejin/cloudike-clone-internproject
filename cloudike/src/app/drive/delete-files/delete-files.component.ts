import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserInfo } from 'src/app/UserInfo';
import { FileManagement } from '../FileManagement';
import { HTTPService } from 'src/app/httpservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.css']
})
export class DeleteFilesComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(private dialogRef: MatDialogRef<DeleteFilesComponent>, private hs: HTTPService, private toastr : ToastrService) { }

  ngOnInit() {

  }




  public delete()
  {
    var formdata = new FormData();
    this.selectitems.forEach((path) => formdata.append("path", path));

    this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/",formdata,this.selectitems.length + "개의 파일 삭제").subscribe(data => {
      this.toastr.error('삭제가 완료되었습니다.');
    }, error => {
      this.toastr.error('에러가 발생했습니다.');
    });
    
    this.dialogRef.close();
  }

}
