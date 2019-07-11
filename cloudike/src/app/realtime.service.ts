import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WebsocketService } from "./websocket.service";
import { UserInfo } from './UserInfo';
import { FileManagement } from './drive/FileManagement';
import { FileItem } from './drive/FileItem';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  private static _messages: Subject<JSON[]>;
  public get messages()
  {
      return RealtimeService._messages;
  }
  private static wsService: WebsocketService = null;
  constructor(private http: HttpClient) {
    if (RealtimeService.wsService == null)
    {
      RealtimeService.wsService = new WebsocketService();
      let url = "wss://api.cloudike.kr/subscribe/?token=" + UserInfo.token + "&timestamp=" +new Date().getTime();
      // pipe를 통해 메세지를 변화시킴
      // any 타입에서 res
      RealtimeService._messages = <Subject<JSON[]>> RealtimeService.wsService.connect(url).pipe(       
        map(
          (response : MessageEvent):JSON[] => {
            let data = JSON.parse(response.data);
            return data;
          }
        )
      );

      RealtimeService._messages.subscribe(
        (data : JSON[]) => 
        {
          if (data.length == 0) return;
          data.forEach(element => {
           this.Response(element);
          });
        }

      );
      
    }
  }

  public Response(data: JSON)
  {
    console.log(data);
    switch (data["type"]) {
      case 'folder_created':
      case 'file_created':
        var folder = FileItem.SplitPath(data["path"]);
        FileManagement.getItem(this.http,
          folder[folder.length - 2].path,
          (item) => {
              item["content"][folder[folder.length - 1].name] = new FileItem(data);
          }
        );
        break;
      case 'storage_info':
        UserInfo.storageSize = data["home_storage_size"];
        UserInfo.maxStorageSize = data["hard_quota_size"];
        break;
      default:
        console.log("처리되지 않은 소켓 메세지");
        console.log(data);
        break;
    }
  }
}
