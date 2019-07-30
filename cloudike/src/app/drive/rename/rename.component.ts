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
  b_name: string = this.path.replace("/","")
      .replace(this.path.substr(this.path.lastIndexOf('.')),"");
  
  
  //b_name is before name (unchanged name, except filename extension)
  //b_name은 사용자가 이름을 변경하기 전의 이름, 확장자를 제외한다.

  constructor(private dialogRef: MatDialogRef<RenameComponent>, private router: Router, private hs: HTTPService) { }

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
        var ext = element.toString().substr(element.lastIndexOf('.') + 1);
        //path에 있는 내용 중 .이후의 글자는 확장자
        console.log("ext is "+ext);
        ext = '.'+ext; //확장자에 '.'기호를 달아준다.

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