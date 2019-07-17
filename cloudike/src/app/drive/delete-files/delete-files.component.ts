import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'src/app/UserInfo';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.css']
})
export class DeleteFilesComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DeleteFilesComponent>, private http: HttpClient) { }

  ngOnInit() {
  }




  public delete()
  {

    var formdata = new FormData();
    var list= document.getElementsByName("chk_info");
    list.forEach((element : HTMLInputElement) => {
      if(element.checked){
        formdata.append("path", element.value);
      }
    });

    this.http.post("https://api.cloudike.kr/api/1/fileops/multi/delete/",formdata, {
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe(data => {
      // 성공
    });


    
    this.dialogRef.close();
  }

}
