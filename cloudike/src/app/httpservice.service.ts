import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { UserInfo } from './UserInfo';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private _unique_num = 0;
  private _queue = {};

  public get queue()
  {
    return Object.values(this._queue);
  }
  constructor(private http: HttpClient) { 
      console.log("HTTPService");
  }

  public post(url:string, body, message="", try_count : number = 3, num?) : Subject<any>
  {
    var new_event = new Subject();
    if (message == "")
      message = "알 수 없는 작업";

    if (num == null)
    {
      num =  this._unique_num++;
      this._queue[num] = message;
    }
    try_count--;
    this.http.post(url,body,{
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe
    (
        data=> {
          delete(this._queue[num]);
          new_event.next(data);
        },
        error=>
        {
            if (try_count > 0)
              this.post(url,body, message, try_count, num);
            else
            {
              delete(this._queue[num]);
              new_event.error(error);
            }
        }
    );
    return new_event;
  }
}
