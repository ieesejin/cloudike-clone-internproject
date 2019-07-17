import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-move-file',
  templateUrl: './move-file.component.html',
  styleUrls: ['./move-file.component.css']
})
export class MoveFileComponent implements OnInit {

  public path : string = null;
  constructor() {
  }

  ngOnInit() {
  }
  public change_path = (url: string) =>
  {
    console.log(this);
    this.path = url;
  }

}
