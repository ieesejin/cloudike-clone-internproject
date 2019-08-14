import { Component, OnInit } from '@angular/core';
import { FileManagement } from '../FileManagement';
import { MatDialogRef } from '@angular/material';
import { CloudikeApiService } from 'src/app/cloudike-api.service';

@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {

  public path : string = null;
  public selectitems = FileManagement.getSelectItemPath();
  constructor(private dialogRef: MatDialogRef<MoveFileComponent>,  private api : CloudikeApiService) {
  }

  ngOnInit() {
  }

  public change_path = (url: string) =>
  {
    console.log(this);
    this.path = url;
  }
  
  public move()
  {
    this.selectitems.forEach(element => {
      this.api.Move(element, this.path);
    });
    this.dialogRef.close();
  }

  public copy()
  {
    this.selectitems.forEach(element => {
      this.api.Copy(element, this.path);
    });
    this.dialogRef.close();
  }

}
