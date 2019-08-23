import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'
import { FileManagement } from '../../FileManagement';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

@Component({
  selector: 'app-rename',
  templateUrl: './rename.component.html',
  styleUrls: ['./rename.component.css']
})
export class RenameComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();
  path: string = this.selectitems.toString();
  public b_name: string;

  //b_name is before name (unchanged name, except filename extension)
  //b_name은 사용자가 이름을 변경하기 전의 이름, 확장자를 제외한다.

  constructor(public dialogRef: MatDialogRef<RenameComponent>, private api: CloudikeApiService) {
    var index = this.path.indexOf('.');
    var f_name: string[] = this.path.split("/");
    var m_name: string = f_name[f_name.length - 1];


    if (this.path.indexOf('.') == -1) //폴더일 경우
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

  public rename(name: string) {
    this.selectitems.forEach(element => {
      if (element.indexOf(".") == -1) {
        //폴더의 이름 변경
        this.api.Rename(element, name);
      }

      else { //파일의 이름 변경
        var ext = element.toString().substr(element.lastIndexOf('.'));
        //path에 있는 내용 중 .을 포함한 글자들은 확장자
        this.api.Rename(element, name + ext);
      }
      this.dialogRef.close();
    });
  }
}