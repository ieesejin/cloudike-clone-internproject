import { Injectable } from '@angular/core';
import { HTTPService } from './httpservice.service';
import { FileManagement } from './drive/FileManagement';
import { FileItem } from './drive/FileItem';

@Injectable({
  providedIn: 'root'
})
export class ValueStorageService {

  public get dataFolderPath()
  {
    return '/' + this.dataFolder;
  }
  private dataFolder = ".values";

  constructor(private hs : HTTPService) { 
    
    FileManagement.getItem(this.hs,"/",
    (item: FileItem) => {
      if (item.content[this.dataFolder] == null)
      {
        var formdata = new FormData();
        formdata.append("path",this.dataFolderPath);
        this.hs.post("https://api.cloudike.kr/api/1/fileops/folder_create/",formdata, "옵션 세팅용 폴더 생성").subscribe(data => {
          // 성공
          FileManagement.getItem(this.hs,this.dataFolderPath);
        });
      }
    });
  }

  private encoding(key, value = null)
  {
     var data = key + "&" + value;
     if (value == null)
        data = key + "&";
        data = data.split('/').join('(slash)');
        data = data.split('?').join('(question)');
     return data;
  }
  private decoding(data : String)
  {
    data = data.split('(slash)').join('/');
    data = data.split('(question)').join('?');
    var result = data.split("&");
    return {key: result[0], value: result[1]};
  }
  public GetToString(key)
  {
    var value = null;
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {
      Object.keys(item.content).forEach(element => {
        if (element.indexOf(this.encoding(key)) == 0)
        {
           value = this.decoding(element).value;
        }
      });
    }
    );
    return value;
  }

  public GetValues()
  {
    var value = [];
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {
      Object.keys(item.content).forEach(element => {
          value.push(this.decoding(element));
      });
    }
    );
    return value;
  }

  public Set(key, value)
  {
    console.log(this.encoding(key));
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {

      var data = this.GetToString(key);
      var formdata = new FormData();
      if (data != null)
      {
        formdata.append("path", this.dataFolderPath + "/" + this.encoding(key,data));
        formdata.set("newname",  this.encoding(key,value));
        this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/",
        formdata, " 이름 변경").subscribe(data => { });
      }
      else
      {
        formdata.append("path","/.values/" + this.encoding(key,value));
        this.hs.post("https://api.cloudike.kr/api/1/fileops/folder_create/",formdata, "옵션 설정중").subscribe(data => {
          // 성공
        });
      }
    });
  }
}
