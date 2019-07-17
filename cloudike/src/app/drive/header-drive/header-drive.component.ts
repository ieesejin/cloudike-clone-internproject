import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { DeleteFilesComponent } from '../delete-files/delete-files.component';

@Component({
  selector: 'app-header-drive',
  templateUrl: './header-drive.component.html',
  styleUrls: ['./header-drive.component.css']
})
export class HeaderDriveComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public new_folder()
  {
    this.dialog.open(NewFolderComponent);
  }
  public delete_file()
  {
    this.dialog.open(DeleteFilesComponent);

  }
}
