import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { CompleteDeleteComponent } from '../dialog/complete-delete/complete-delete.component';
import { FileManagement } from '../FileManagement';
import { SelectDeleteComponent } from '../dialog/select-delete/select-delete.component';
import { RestoreComponent } from '../dialog/restore/restore.component';

@Component({
  selector: 'app-trash-header',
  templateUrl: './trash-header.component.html',
  styleUrls: ['./trash-header.component.css']
})
export class TrashHeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
  public get selectItem()
  {
    return FileManagement.getSelectItemPath();
  }
  public completeDelete() {
    this.dialog.open(CompleteDeleteComponent);
  }

  public select_delete(){
    this.dialog.open(SelectDeleteComponent);
  }

  public restore(){
    this.dialog.open(RestoreComponent);
  }
}
