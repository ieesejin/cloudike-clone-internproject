import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { WebsocketService } from "./websocket.service";
import { UserInfo } from './UserInfo';



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
  constructor() {
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
           RealtimeService.Response(element);
          });
        }

      );
      
    }
  }

  public static Response(data: JSON)
  {
    console.log(data);
  }
}
