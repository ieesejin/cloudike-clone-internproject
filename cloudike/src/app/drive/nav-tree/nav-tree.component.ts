import { Component, OnInit } from '@angular/core';
import { FileItem } from '../FileItem';
import { DriveComponent } from '../drive.component';
import { FileManagement } from '../FileManagement';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css']
})
export class NavTreeComponent implements OnInit {

  root : FileItem = new FileItem(null);
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }
  

}
