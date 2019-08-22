import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FileManagement } from 'src/app/drive/FileManagement';
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-select-delete',
  templateUrl: './select-delete.component.html',
  styleUrls: ['./select-delete.component.css']
})
export class SelectDeleteComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();
  path : string = this.selectitems.toString();
  public f_name : string[] = this.path.split("/");

  constructor(private dialogRef: MatDialogRef<SelectDeleteComponent>, private hs: HTTPService
    ,private toastr : ToastrService, @Inject(MAT_DIALOG_DATA) private data) { }

  ngOnInit() {
  }

  public select_delete(){
    var formdata = new FormData();
    var url = "https://api.cloudike.kr/api/1/trash/clear/";
    this.data.forEach(element => {
      formdata.append("paths", element);
    })

    this.hs.post(url, formdata).subscribe(data => {
      var taskid = data['taskid'];
      var timer = setInterval(() => {

        this.hs.get("https://api.cloudike.kr/api/1/task/" + taskid + '/', null, 1).subscribe(

          success => {
            clearInterval(timer);
            this.toastr.success('삭제가 완료되었습니다.');
          },
          error => {

          }
        );
      }, 1000);


    }, error => {
      this.toastr.error('에러가 발생했습니다.');
    });
    this.dialogRef.close();
  }

}