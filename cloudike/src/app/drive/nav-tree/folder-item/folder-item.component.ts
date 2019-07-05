import { Component, OnInit, Input } from '@angular/core';
import { FileItem } from 'src/app/drive/FileItem';
import { DriveComponent } from '../../drive.component';

@Component({
  selector: 'app-folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.css']
})
export class FolderItemComponent implements OnInit {

  @Input() item: FileItem
  @Input() depth: number

  get now():FileItem {
    return DriveComponent.Now;
  }

  constructor() { }

  ngOnInit() {
  }

}
