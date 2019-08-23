import { Component, OnInit } from '@angular/core';
import { FileManagement } from '../../FileManagement';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';
import { MatDialogRef } from '@angular/material';
import { ValueStorageService } from 'src/app/service/ValueStorage/value-storage.service';

@Component({
  selector: 'app-delete-favorites',
  templateUrl: './delete-favorites.component.html',
  styleUrls: ['./delete-favorites.component.css']
})
export class DeleteFavoritesComponent implements OnInit {

  public selectitems = FileManagement.getSelectItemPath();

  constructor(public dialogRef: MatDialogRef<DeleteFavoritesComponent>, private api: CloudikeApiService, private valueStorate: ValueStorageService) { }

  ngOnInit() {

  }

  public delete() {
    this.selectitems.forEach(element => {
      this.api.SetFavoriteOfItem(this.valueStorate, element, false);
    });
    this.dialogRef.close();
  }

}
