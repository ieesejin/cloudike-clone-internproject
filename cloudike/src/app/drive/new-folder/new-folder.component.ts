import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-new-folder',
  templateUrl: './new-folder.component.html',
  styleUrls: ['./new-folder.component.css']
})
export class NewFolderComponent implements OnInit {

  inputName: string = "";
  constructor(private dialogRef: MatDialogRef<NewFolderComponent>) { }

  ngOnInit() {
  }

}
