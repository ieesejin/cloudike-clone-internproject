import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FileManagement } from '../FileManagement';
import { HTTPService } from 'src/app/service/HttpService/httpservice.service';
import { DeleteFavoritesComponent } from '../dialog/delete-favorites/delete-favorites.component';

@Component({
  selector: 'app-header-favorites',
  templateUrl: './header-favorites.component.html',
  styleUrls: ['./header-favorites.component.css']
})
export class HeaderFavoritesComponent implements OnInit {

  constructor(private dialog: MatDialog, private hs: HTTPService) { }
  
  public get selectItem()
  {
    return FileManagement.getSelectItemPath();
  }

  ngOnInit() {
  }

  public delete_file()
  {
    this.dialog.open(DeleteFavoritesComponent);
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
