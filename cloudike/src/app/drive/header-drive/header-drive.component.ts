import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material';
import { NewFolderComponent } from '../new-folder/new-folder.component';
import { DeleteFilesComponent } from '../delete-files/delete-files.component';
import { MoveFileComponent } from '../move-file/move-file.component';
import { FileManagement } from '../FileManagement';
import { RenameComponent } from '../rename/rename.component';
import { ShareComponent } from '../share/share.component';
import { FileItem } from '../FileItem';
import { HTTPService } from 'src/app/httpservice.service';

@Component({
  selector: 'app-header-drive',
  templateUrl: './header-drive.component.html',
  styleUrls: ['./header-drive.component.css']
})
export class HeaderDriveComponent implements OnInit {


  public get selectItem()
  {
    return FileManagement.getSelectItemPath();
  }
  
  constructor(public dialog: MatDialog, private hs : HTTPService) { }

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
  public move_file()
  {
    this.dialog.open(MoveFileComponent);
  }
  public rename_file()
  {
    this.dialog.open(RenameComponent);
  }
  public share_file()
  {
    this.dialog.open(ShareComponent);
  }

  public Download()
  {
    this.selectItem.forEach( (path)=>
      FileManagement.getItem(this.hs,path,(item)=>{
        item.Download(this.hs);
      })
    )
  }
}
