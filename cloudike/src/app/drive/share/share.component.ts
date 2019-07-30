import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/httpservice.service';
import { FileManagement } from '../FileManagement';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();
  public link : string;
  public obj: Object;

  constructor(private dialogRef: MatDialogRef<ShareComponent>,
    private router: Router, private hs: HTTPService)
    {
        //At first, generate public link
        //공유 버튼을 누르면 최초에 공유 링크가 자동적으로 생성된다.
        this.selectitems.forEach(element => {
          var formdata = new FormData();
          formdata.set("path", element);
          //console.log("formdata.get(path) is "+formdata.get("path"));//path


          this.obj = this.hs.post("https://api.cloudike.kr/api/1/links/create/", formdata, "공유링크 생성")
          .subscribe(response =>{
            this.link = 'https://'+ UserInfo.domain + '.cloudike.kr/public/' + <any>response['public_hash'];
            //It can return the value 'public_hash' in this.link
            //public_hash를 this.link에 넣음으로써 html로 넘길 수 있게 한다.
          });
          

        });
     }

  ngOnInit() {

   
  }

  public create(){

      this.selectitems.forEach(element => {
        var formdata = new FormData();
        formdata.set("path", element);

        //console.log(element);
        this.obj = this.hs.post("https://api.cloudike.kr/api/1/links/create/", formdata, "공유링크 생성")
        .subscribe(response =>{
          this.link = 'https://'+ UserInfo.domain + '.cloudike.kr/public/' + <any>response['public_hash'];
        }); 
        //It can return the value 'public_hash' in this.link
        //public_hash를 this.link에 넣음으로써 html로 넘길 수 있게 한다.
      });

  }


  public delete(){
    this.selectitems.forEach(element => {
      var formdata = new FormData();
      formdata.set("path", element);
      
      //console.log(element);
      this.hs.post("https://api.cloudike.kr/api/1/links/delete/", formdata, "공유링크 삭제");
      this.link = '링크가 생성되지 않았습니다.';
      //Delete the public link that already created
      //생성되어있는 공유 링크 삭제
    });
  }

  public copy(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  // https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard

}
