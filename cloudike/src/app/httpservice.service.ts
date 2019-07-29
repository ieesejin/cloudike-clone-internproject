import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, timer, interval } from 'rxjs';
import { UserInfo } from './UserInfo';
import { startWith, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HTTPService {
  private _unique_num = 0;
  private max_queue = 0;
  private _queue = {};

  public progress = 0;

  public end = 0;
  public get queue()
  {
    return Object.values(this._queue);
  }
  constructor(private http: HttpClient) { 
    interval(200).subscribe(res => 
    {
      if (this.end > 0)
      {
        this.progress = 100;
        this.end--;
      }
      else if (this.end == 0)
      {
        if (this.max_queue == 0) this.progress = 0;
        else
        {
          var cnt = (this.max_queue - this.queue.length);// 남은 개수
          var want = ((cnt+0.9) / this.max_queue) * 100;
          if (this.progress < want)
          {
            this.progress += 5;
          }
          else
          {
            this.progress = want;
          }

        }
      }
    })
  ;

      console.log("HTTPService");
  }

  private remove_in_queue(num)
  {
    delete(this._queue[num]);
    if (this.queue.length == 0)
    {
      this.max_queue = 0;
      this.end = 10;
    }
  }



  public get(url:string,  message="", try_count : number = 3, num?) : Subject<any>
  {
    var new_event = new Subject();
    if (message == "")
      message = "알 수 없는 작업";

    if (num == null)
    {
      num =  this._unique_num++;
      this.max_queue++;
      this._queue[num] = message;
      this.end = 0;
      this.progress = 0;
    }
    try_count--;
    this.http.get(url,{
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe
    (
        data=> {
          this.remove_in_queue(num);
          new_event.next(data);
        },
        error=>
        {
            if (try_count > 0)
              this.get(url, message, try_count, num);
            else
            {
              this.remove_in_queue(num);
              new_event.error(error);
            }
        }
    );
    return new_event;
  }

  public post(url:string, body, message="", try_count : number = 3, num?) : Subject<any>
  {
    var new_event = new Subject();
    if (message == "")
      message = "알 수 없는 작업";

    if (num == null)
    {
      num =  this._unique_num++;
      this.max_queue++;
      this._queue[num] = message;
    }
    try_count--;
    this.http.post(url,body,{
      headers: {'Mountbit-Auth':UserInfo.token}
    }).subscribe
    (
        data=> {
          this.remove_in_queue(num);
          new_event.next(data);
        },
        error=>
        {
            if (try_count > 0)
              this.post(url,body, message, try_count, num);
            else
            {
              this.remove_in_queue(num);
              new_event.error(error);
            }
        }
    );
    return new_event;
  }
}
