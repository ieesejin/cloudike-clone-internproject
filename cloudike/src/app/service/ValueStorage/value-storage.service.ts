import { Injectable } from '@angular/core';
import { HTTPService } from '../HttpService/httpservice.service';
import { FileManagement } from '../../drive/FileManagement';
import { FileItem } from '../../drive/FileItem';
import { CloudikeApiService } from '../CloudikeAPI/cloudike-api.service';

type PredicateFn<T> = (item: T) => boolean;
type PipeFn<T> = (item: T) => any;

@Injectable({
  providedIn: 'root'
})
export class ValueStorageService {

  public get dataFolderPath()
  {
    return '/' + this.dataFolder;
  }
  private dataFolder = ".values";

  constructor(private hs : HTTPService, private api : CloudikeApiService) { 
    
    FileManagement.getItem(this.hs, "/", (item: FileItem) => {
      this.reset_cache();
      if (item.content[this.dataFolder] == null) {
        var formdata = new FormData();
        formdata.append("path", this.dataFolderPath);
        this.api.CreateFolder(this.dataFolderPath).subscribe(data => {
          // 성공
          FileManagement.getItem(this.hs, this.dataFolderPath);
        }
        );
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
    var data = this.GetValues(key, item=> item.key == key);
    return data.length > 0 ? data[0].value : null;
  }
  public reset_cache()
  {
    this.cache = {};
  }
  private cache = {};
  
  // 읽어올 변수 조건, 리턴받고싶은 형태
  public GetValues(unique_key, predicate: PredicateFn<{key,value}>, pipe : PipeFn<{key,value}> = null)
  {
    if (this.cache[unique_key])
      return this.cache[unique_key];
      
    var value = [];
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {
      Object.keys(item.content).forEach(element => {
        
        var data = this.decoding(element);
        if (predicate(data))
        {
          if (pipe == null)
            value.push(data);
          else
            value.push(pipe(data));
        }
      });
    }
    );
    this.cache[unique_key] = value;
    return this.cache[unique_key];
  }

  public Set(key, value)
  {
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {

      var data = this.GetToString(key);
      // 기존에 폴더가 있으면 이름 변경, 없으면 만들기
      if (data != null)
        this.api.Rename(this.dataFolderPath + "/" + this.encoding(key,data),this.encoding(key,value)).unsubscribe();
      else
        this.api.CreateFolder(this.dataFolderPath, this.encoding(key,value)).unsubscribe();

    });
  }
}
