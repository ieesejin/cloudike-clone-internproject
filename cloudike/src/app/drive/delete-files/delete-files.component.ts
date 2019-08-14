import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FileManagement } from '../FileManagement';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.css']
})
export class DeleteFilesComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(private dialogRef: MatDialogRef<DeleteFilesComponent>, private api :CloudikeApiService) { }

  ngOnInit() {

  }

  public delete()
  {
    this.api.MultiDelete(this.selectitems);    
    this.dialogRef.close();
  }

}
