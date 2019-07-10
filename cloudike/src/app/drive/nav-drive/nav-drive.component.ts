import { Component, OnInit } from '@angular/core';
import { FileItem } from '../FileItem';
import { DriveComponent } from '../drive.component';
import { FileManagement } from '../FileManagement';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-drive',
  templateUrl: './nav-drive.component.html',
  styleUrls: ['./nav-drive.component.css']
})
export class NavDriveComponent implements OnInit {

  root : FileItem = new FileItem(null);
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  

}
