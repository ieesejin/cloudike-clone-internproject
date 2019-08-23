import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UserInfo } from 'src/app/UserInfo';
import { FileManagement } from '../../FileManagement';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-complete-delete',
  templateUrl: './complete-delete.component.html',
  styleUrls: ['./complete-delete.component.css']
})
export class CompleteDeleteComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(public dialogRef: MatDialogRef<CompleteDeleteComponent>, private hs: HTTPService
    ,private toastr : ToastrService ) { }

  ngOnInit() {
  }

  public delete()
  {

    var formdata = new FormData();
    var url = "https://api.cloudike.kr/api/1/trash/clear/";
    this.selectitems.forEach((path) => formdata.append("path", path));

    this.hs.post(url,formdata,this.selectitems.length + "개의 파일 삭제").subscribe(data => {
      // 성공
      this.hs.post(url, formdata).subscribe(data => {
        var taskid = data['taskid'];
        var timer = setInterval(() => {
  
          this.hs.get("https://api.cloudike.kr/api/1/task/" + taskid + '/', null, 1).subscribe(
  
            success => {
              clearInterval(timer);
              this.toastr.success('영구삭제가 완료되었습니다.');
            },
            error => {
  
            }
          );
        }, 1000);
  
  
      }, error => {
        this.toastr.error('에러가 발생했습니다.');
      });
      this.dialogRef.close();
    });
  }
  
}
