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

  private encoding(key, _value : {} = null)
  {
    var value = JSON.stringify(_value);
     var data = key + "&" + value;
     if (value == null)
        data = key + "&";
    data = data.split('/').join('◐1');
    data = data.split('?').join('◐2');
    data = data.split('|').join('◐3');
    data = data.split('"').join('◐4');
    data = data.split(':').join('◐5');
     return data;
  }
  private decoding(data : String)
  {
    data = data.split('◐1').join('/');
    data = data.split('◐2').join('?');
    data = data.split('◐3').join('|');
    data = data.split('◐4').join('"');
    data = data.split('◐5').join(':');
    var result = data.split("&");
    return {key: result[0], value: JSON.parse(result[1])};
  }
  public GetToJson(key) : {}
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
  public GetValues(unique_key, predicate: PredicateFn<{key,value:{}}>, pipe : PipeFn<{key,value:{}}> = null, dir = false)
  {
    if (this.cache[unique_key])
      return this.cache[unique_key];
      
    var value : any = [];
    if (dir) value = {};
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {
      Object.keys(item.content).forEach(element => {
        
        var data = this.decoding(element);
        if (predicate(data))
        {
          if (pipe == null)
            value.push(data);
          else
          {
            var temp = pipe(data);
            if (dir)
              value[temp.key] = temp.value;
            else
              value.push(temp);
          }
        }
      });
    }
    );
    this.cache[unique_key] = value;
    return this.cache[unique_key];
  }

  public Set(key, value:{})
  {
    FileManagement.getItem(this.hs,this.dataFolderPath, 
    (item: FileItem) => {

      var data = this.GetToJson(key);
      // 기존에 폴더가 있으면 이름 변경, 없으면 만들기
      if (data != null)
        this.api.Rename(this.dataFolderPath + "/" + this.encoding(key,data),this.encoding(key,value)).unsubscribe();
      else
        this.api.CreateFolder(this.dataFolderPath, this.encoding(key,value)).unsubscribe();

    });
  }
}
