import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from 'src/app/UserInfo';
import { Router } from '@angular/router';
import { FileItem } from '../FileItem';

@Component({
  selector: 'app-header-drive',
  templateUrl: './header-drive.component.html',
  styleUrls: ['./header-drive.component.css']
})
export class HeaderDriveComponent implements OnInit {

  constructor(public dialog: MatDialog, public http:HttpClient, public router: Router) { }

  ngOnInit() {
  }

  public click()
  {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(NewFolderComponent, { width: '250px' });
    dialogRef.afterClosed().subscribe(result => { 
      if (result != null)
      {
        console.log("폴더 만들기" + result);
        var formdata = new FormData();
        var url = this.router.url.substring("/drive".length);

        if (url == "" || url[0] != '/') url = '/' + url;
        if (url[url.length-1] != '/') url =  url + '/';

        formdata.append("path", url + result);
        this.http.post("https://api.cloudike.kr/api/1/fileops/folder_create/",formdata, {
          headers: {'Mountbit-Auth':UserInfo.token}
        }).subscribe(data => {
          console.log("성공");
        });


      }
      });
  }
}
