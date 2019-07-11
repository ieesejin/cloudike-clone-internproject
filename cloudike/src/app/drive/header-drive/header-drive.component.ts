import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';

@Component({
  selector: 'app-header-drive',
  templateUrl: './header-drive.component.html',
  styleUrls: ['./header-drive.component.css']
})
export class HeaderDriveComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  public click()
  {
    this.dialog.open(NewFolderComponent, { width: '250px' });
  }
}
