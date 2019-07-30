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

  public selectitems = FileManagement.getSelectItemPath();
  path : string = this.selectitems.toString();
  public b_name : string;
  
  //b_name is before name (unchanged name, except filename extension)
  //b_name은 사용자가 이름을 변경하기 전의 이름, 확장자를 제외한다.

  constructor(private dialogRef: MatDialogRef<RenameComponent>,private router: Router,
    private hs: HTTPService)
    {
      var index = this.path.indexOf('.');
      var f_name : string[] = this.path.split("/");
      var m_name : string = f_name[f_name.length-1];

      
      if(this.path.indexOf('.') == -1) //폴더일 경우
      {
        this.b_name = m_name;
      }
      else //파일일 경우
      {
        this.b_name = m_name.substr(0, m_name.lastIndexOf('.'));
      }


      console.log(this.b_name);

     }

  ngOnInit() {
  }

  public rename(name : string)
  {
    this.selectitems.forEach(element => {
      var formdata = new FormData();

      if(element.indexOf( "." ) == -1){
        //폴더의 이름 변경
        formdata.set("path", element);
        formdata.set("newname", name);

        console.log(element);
        console.log(name);
        this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/",
        formdata, element + " 이름 변경").subscribe(data => { });
      }
  
      else { //파일의 이름 변경
        var ext = element.toString().substr(element.lastIndexOf('.'));
        //path에 있는 내용 중 .을 포함한 글자들은 확장자
        console.log("ext is "+ext);
        
        formdata.set("path", element);
        formdata.set("newname", name+ext);
        //api에 넘길 때, 자동으로 확장자를 붙여준다.
        console.log(element);
        console.log(name);
        this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/",
        formdata, element + " 이름 변경").subscribe(data => { });
      }
      this.dialogRef.close();
  
    });

  }


}