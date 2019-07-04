import { Component, OnInit } from '@angular/core';
import { FileItem } from '../FileItem';
import { DriveComponent } from '../drive.component';

@Component({
  selector: 'app-nav-tree',
  templateUrl: './nav-tree.component.html',
  styleUrls: ['./nav-tree.component.css']
})
export class NavTreeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  get root():FileItem {
    return DriveComponent.Root;
}

}
