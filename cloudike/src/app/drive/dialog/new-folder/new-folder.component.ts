import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'
import { Router } from '@angular/router';
import { UserInfo } from 'src/app/UserInfo';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { ToastrService } from 'ngx-toastr';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

  inputName: string = "";
  constructor(public dialogRef: MatDialogRef<NewFolderComponent>, private api : CloudikeApiService) { }

  ngOnInit() {
  }

  public create(name: string) {
    this.api.CreateFolder(this.api.GetURLPath(), name);
    this.dialogRef.close();
  }
}
