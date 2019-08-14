import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WebsocketService } from "./websocket.service";
import { UserInfo } from './UserInfo';
import { FileManagement } from './drive/FileManagement';
import { FileItem } from './drive/FileItem';
import { HTTPService } from './httpservice.service';
import { ValueStorageService } from './value-storage.service';



@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  private static _messages: Subject<JSON[]>;
  private static wsService: WebsocketService = null;
  constructor(private hs: HTTPService, private valueStorage : ValueStorageService) {
    this.CreateSocket();
  }


  public CreateSocket()
  {
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
        ,
        (error) =>
        {
          console.log(error);
        }
        ,
        () =>
        {
          RealtimeService._messages = null;
          RealtimeService.wsService = null;
          console.log("소켓 종료됨");
          this.CreateSocket();
        }
      );
    }
  }
  public Response(data: JSON)
  {
    var folder = null;
    var parent_path = null;
    var name = null;
    var path = null;
    if (data["path"] != null)
    {
      folder = FileItem.SplitPath(data["path"]);
      name = folder[folder.length - 1].name;
      path = folder[folder.length - 1].path;

      if (folder.length > 1)
        parent_path = folder[folder.length - 2].path;
    }
    switch (data["type"]) {
      case 'folder_created':
      case 'file_created':
      case 'folder_copied':
      case 'file_copied':
        if (!FileManagement.contains(parent_path)) return;
        FileManagement.getItem(this.hs,
          parent_path,
          (item) => {
              item["content"][name] = new FileItem(data);
              this.valueStorage.reset_cache();
          }
        );
        break;
      case 'file_new_content':
          if (!FileManagement.contains(parent_path)) return;
          FileManagement.getItem(this.hs,
            parent_path,
            (item) => {
                item["content"][name] = new FileItem(data);
            }
          );
          break;
      case 'file_deleted':
      case 'folder_deleted':
          FileManagement.removeItem(data["path"]);
          this.valueStorage.reset_cache();
          break;

      case 'file_renamed':
      case 'folder_renamed':
        var parent_path = folder[folder.length - 2].path;
        var old_path = parent_path + '/' + data["oldname"];
        
        FileManagement.rename(old_path, data["path"]);
        this.valueStorage.reset_cache();
        break;
      case 'folder_moved':
      case 'file_moved':
        FileManagement.rename(data["oldpath"],data["path"]);
        break;
      case 'link_created':
        FileManagement.link_set(data["path"], data["public_hash"]);
        break;
      case 'link_deleted':
        FileManagement.link_set(data["path"], null);
        break;
      case 'extradata_created':
        if (!FileManagement.contains(parent_path)) return;
        FileManagement.getItem(this.hs, path,
          (item : FileItem) => {
                if (data["processed_interfaces"] == null) return;
                var thumbnails = data["processed_interfaces"]["thumbnails"];
                if (thumbnails != null)
                {
                  Object.keys(thumbnails).forEach(key => {
                    item.extraData[key] = thumbnails[key]["link"];
                  });
                }
                var pdf = data["processed_interfaces"]["pdf"];
                if (pdf != null)
                {
                  item.extraData["pdf"] = pdf;
                }
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
